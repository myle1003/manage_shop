const slugify = require('slugify')
    // Slugify config options
const options = {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'en',
    trim: true,
}
async function SlugF(title, check) {
    // nb = await Post.countDocuments() + 1;
    if (check == 1) {
        return "H3m:/bai-viet/" + nb + "/" + slugify(title, options);
    } else {
        return "H3m:/danh-muc/" + slugify(title, options);
    }
}
module.exports = SlugF;