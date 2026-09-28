export interface BaseRepository <T>{
    findById (id:string):Promise<T>
}