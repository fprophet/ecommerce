const ejshelper = {
  findCategById: function (categories, id) {
    return categories.find((elem) => elem.id == id);
  },
  getCategoryLinkName: function (name) {
    return name.trim().replaceAll(" ", "-").toLowerCase();
  },
};
module.exports = ejshelper;
