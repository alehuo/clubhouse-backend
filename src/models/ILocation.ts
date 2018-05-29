export default interface ILocation {
  locationId?: number;
  name: string;
  address: string;
  created_at?: Date;
  updated_at?: Date;
};

export const locationFilter = (location: ILocation) => location;
