import { Model } from "mongoose";

interface PaginatePayload {
  model: Model<any>;
  page: number;
  limit: number;
  filter?: any;
  sort?: any;
  search?: string;
  searchFields?: string[];
  pipeline?: any[];
}

export const paginate = async (opts: PaginatePayload) => {
  const {
    model,
    page,
    limit,

    filter = {},
    sort = { createdAt: -1 },
    search = "",
    searchFields = [],
    pipeline = [],
  } = opts;

  const skip = (page - 1) * limit;

  // ✅ Apply text search (for normal queries)
  if (search && searchFields.length > 0 && pipeline.length === 0) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  // ✅ CASE 1: Aggregation-based pagination
  if (pipeline.length > 0) {
    const finalPipeline = [...pipeline];

    // Optional: Add text search into aggregation pipeline
    if (search && searchFields.length > 0) {
      finalPipeline.unshift({
        $match: {
          $or: searchFields.map((f) => ({
            [f]: { $regex: search, $options: "i" },
          })),
        },
      });
    }

    const countPipeline = [...finalPipeline, { $count: "totalDocs" }];
    const totalResult = await model.aggregate(countPipeline);
    const totalDocs = totalResult[0]?.totalDocs || 0;

    const data = await model.aggregate([
      ...finalPipeline,
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      data,
      meta: {
        totalDocs,
        page,
        limit,
        skip, // ✅ added here

        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    };
  }

  // ✅ CASE 2: Normal find() pagination
  const data = await model.find(filter).sort(sort).skip(skip).limit(limit);
  const totalDocs = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalDocs / limit);

  return {
    data,
    meta: {
      totalDocs,
      page,
      limit,
      skip,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    },
  };
};
