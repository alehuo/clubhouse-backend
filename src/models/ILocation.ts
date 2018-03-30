export default interface ILocation {
  locationId?: number;
  name: string;
  address: string;
};

export const locationFilter = (location: ILocation) => location;
