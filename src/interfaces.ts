export interface IPage {
    idpage?: number;
    descripcion?: string;
    titulo?: string;
    url?: string;
    estatus?: string;
}

export interface IPagesGroup {
    idpage?: number; 
    titulo?: string; 
    descripcion?: string;
    urlpage?: string;
    idgrupo?: number; 
    grupo?: string;
    urlgrupo?: string;
}