


export interface IPoint {
  seq?: number;
  lat?: number;
  lon?: number;
  typ?: string;
  stpid?: string;
  stpnm?: string;
  pdist?: number;
}

export interface IPattern {
  pid?: number;
  ln?: number;
  rtdir?: string;
  pt?: IPoint[];
};
