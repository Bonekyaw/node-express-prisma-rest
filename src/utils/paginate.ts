const asyncHandler = require("express-async-handler");

export const offset = asyncHandler(
  async (
    model: any,
    page = 1,
    limit = 10,
    filters = {},
    order = {},
    fields = {},
    relation = null
  ) => {
    const offset = (page - 1) * limit;

    const options = relation
      ? {
          skip: offset,
          take: limit,
          where: filters,
          orderBy: order,
          select: fields,
        }
      : {
          skip: offset,
          take: limit,
          where: filters,
          orderBy: order,
          include: relation,
        };
    const count = await model.count({ where: filters });
    const results = await model.findMany(options);

    return {
      total: count,
      data: results,
      currentPage: page,
      previousPage: page == 1 ? null : page - 1,
      nextPage: page * limit >= count ? null : page + 1,
      lastPage: Math.ceil(count / limit),
      countPerPage: limit,
    };
  }
);

export const noCount = asyncHandler(
  async (
    model: any,
    page = 1,
    limit = 10,
    filters = {},
    order = {},
    fields = {},
    relation = null
  ) => {
    const offset = (page - 1) * limit;

    const options = relation
      ? {
          skip: offset,
          take: limit + 1,
          where: filters,
          orderBy: order,
          select: fields,
        }
      : {
          skip: offset,
          take: limit + 1,
          where: filters,
          orderBy: order,
          include: relation,
        };
    const results = await model.findMany(options);
    let hasNextPage = false;
    if (results.length > limit) {
      // if got an extra result
      hasNextPage = true; // has a next page of results
      results.pop(); // remove extra result
    }

    return {
      data: results,
      currentPage: page,
      previousPage: page == 1 ? null : page - 1,
      nextPage: hasNextPage ? page + 1 : null,
      countPerPage: limit,
    };
  }
);

export const cursor = asyncHandler(
  async (
    model: any,
    cursor = null,
    limit = 10,
    filters = {},
    order = [],
    fields = {},
    relation = null
  ) => {

    const options = relation
      ? cursor
        ? {
            take: limit,
            skip: 1, // Skip the cursor
            cursor: cursor,
            where: filters,
            orderBy: order,
            select: fields,
          }
        : {
            take: limit,
            where: filters,
            orderBy: order,
            select: fields,
          }
      : cursor
        ? {
            take: limit,
            skip: 1, // Skip the cursor
            cursor: cursor,
            where: filters,
            orderBy: order,
            include: relation,
          }
        : {
            take: limit,
            where: filters,
            orderBy: order,
            include: relation,
          };
    const results = await model.findMany(options);
    const lastPostInResults = results[limit - 1]; // Remember: zero-based index! :)
    const myCursor = lastPostInResults.id; 

    return {
      data: results,
      nextCursor: myCursor,
    };
  }
);
