const ejshelper = {
  findCategById: function (categories, id) {
    return categories.find((elem) => elem.id == id);
  },
};
module.exports = ejshelper;
