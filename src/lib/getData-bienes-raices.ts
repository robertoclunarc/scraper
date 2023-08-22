import { IPage, IPagesGroup } from "interfaces/paginas.interface";
import db from "../database";


export const SelectPagesAll = async () => {
    let consulta = "SELECT * FROM paginas";
    let pages: IPage[]=[];
    try {        
        const result = await db.querySelect(consulta);       
        if (result.length > 0) {
            pages = result[0];            
        }

    } catch (error) {
        console.log({ err: error });
    }

    return pages;
}

export const SelectPagesGroupAll = async () => {
    let consulta = "select a.idpage, a.titulo, a.descripcion, a.url as urlpage, b.idgrupo, b.grupo, b.url as urlgrupo from paginas a inner join grupos b on a.idpage=b.fkpage and a.estatus='ACTIVO' and b.estatus='ACTIVO' ORDER BY b.grupo;";
    try {
        let pages: IPagesGroup[]=[];
        const result = await db.querySelect(consulta);
        if (result.length> 0) {
            pages = result;            
        }

        return pages;

    } catch (error) {
        return({ err: error });
    }
}