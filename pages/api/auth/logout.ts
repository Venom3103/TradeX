import type {NextApiRequest,NextApiResponse} from 'next'; import cookie from 'cookie';
export default async function handler(req:NextApiRequest,res:NextApiResponse){ res.setHeader('Set-Cookie',cookie.serialize('tx_token','',{httpOnly:true,path:'/',maxAge:0})); res.status(200).json({ok:true})}
