import db from "../config/db";

const createNewToken = async (option: any) => {
  return await db('tokens').insert(option)
};

const findToken = async(option: any) => {
    return await db('tokens').where(option).first()
}

const findTokenById = async(id: number) => {
    return await db('tokens').where('id', id).first();
}

const deleteToken = async(id: number) => {
    return await db('tokens').where('id', id).delete();
}

export {
    createNewToken,
    findToken,
    findTokenById,
    deleteToken
}