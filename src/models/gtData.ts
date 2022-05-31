

export class GTBase {}

export class GTAgency extends GTBase {
  agencyId: string;
  agencyName?: string | null | undefined;
  agencyUrl?: string | null | undefined;
  agencyTimezone?: string | null | undefined;
  agencyLang?: string | null | undefined;
  agencyPhone?: string | null | undefined;
  agencyFareUrl?: string | null | undefined;
  agencyEmail?: string | null | undefined;

  constructor(obj: Partial<GTAgency> = {}) {
    super();
    const { agencyId } = { agencyId: null, ...obj };
    if (!agencyId) throw new TypeError('agencyId is required');
    this.agencyId = agencyId;
    Object.assign(this, obj);
  }
};

export class GTRoute extends GTBase {
  routeId: string;
  agencyId?: string | null | undefined;
  routeShortName?: string | null | undefined;
  routeLongName?: string | null | undefined;
  routeDesc?: string | null | undefined;
  routeType?: number | null | undefined;
  routeUrl?: string | null | undefined;
  routeColor?: string | null | undefined;
  routeSortOrder?: number | null | undefined;
  continuousPickup?: number | null | undefined;
  continousDropOff?: number | null | undefined;

  constructor(obj: Partial<GTRoute> = {}) {
    super();
    const { routeId } = { routeId: null, ...obj };
    if (!routeId) throw new TypeError('routeId is required');
    this.routeId = routeId;
    Object.assign(this, obj);
  }
};
