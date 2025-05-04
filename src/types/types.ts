export interface Parameter {
    id: string;
    timestamp: string;
    paramType: string;
    value: number;
    unit: string;
    notes: string;
  }
  
  export interface WaterChange {
    id: string;
    date: string;
    volumeGallons: number;
    notes: string;
  }
  
  export interface Feeding {
    id: string;
    timestamp: string;
    foodType: string;
    amount: string;
    notes: string;
  }
  
  export interface Tank {
    id: string;
    name: string;
    volumeGallons: number;
    species: string;
    notes: string;
    parameters: Parameter[];
    waterChanges: WaterChange[];
    feedings: Feeding[];
  }