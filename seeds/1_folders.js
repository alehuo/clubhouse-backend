
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('folders').del()
    .then(function () {
      // Inserts seed entries
      return knex('folders').insert([
        {folderId: 1, folderName: '2011'},
        {folderId: 2, folderName: '2012'},
        {folderId: 3, folderName: '2013'},
        {folderId: 4, folderName: '2014'},
        {folderId: 5, folderName: '2015'},
        {folderId: 6, folderName: '2016'},
        {folderId: 7, folderName: '2017'},
        {folderId: 8, folderName: '2018'}
      ]);
    });
};
