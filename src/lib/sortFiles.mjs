function sortFiles(list) {
  list.sort(function (a, b) {
      if (a.Type > b.Type) return 1;
      if (a.Type < b.Type) return -1;

      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
  })
};

export default sortFiles;