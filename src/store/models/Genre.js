import BaseModel from './BaseModel';

class Genre extends BaseModel {
  static reducer(action, Genre/* , session */) {
    const { type } = action;
    switch (type) {
      case 'SONGS_REQUEST':
        // remove all songs when fetching
        Genre.all().delete();
        break;
      case 'LOAD_GENRES':
        Genre.loadData(action.payload, this);
        break;
      default:
        break;
    }
  }
  toString() {
    return `Genre: ${this.name}`;
  }
}

Genre.modelName = 'Genre';

Genre.fields = { };

Genre.shallowFields = {
  id: 'number',
  name: 'string',
  icon: 'string'
};

export default Genre;
