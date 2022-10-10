module.exports = (modelToQuery, populateObject) => async (req, res, next) => {
    const reqQuery = {...req.query}
    const fieldsToExcludeInQueryObject = ['select', 'sort', 'limit', 'page']

    fieldsToExcludeInQueryObject.forEach(f => delete reqQuery[f]);

    const filter = JSON.parse(JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`));

    let query = modelToQuery.find();

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {
        query = query.sort('-name');
    }

    let {page, limit} = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = limit * page;
    const total = await modelToQuery.countDocuments(filter);
    const pagination = {}

    if (endIndex < total) pagination.nextPage = page + 1
    if (startIndex > 0) pagination.previousPage = page - 1;
    pagination.currentPage = page;
    pagination.count = total

    query = query.skip(startIndex).limit(limit);

    const results = await query.find(filter).populate(populateObject);

    res.shapedData = {
        pagination,
        data: results
    }
    next();
}