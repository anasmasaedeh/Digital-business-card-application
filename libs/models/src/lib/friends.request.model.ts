

export interface Friends extends Document {

requester: string,


recipient:string,


status:'pending'|'accepted'|'rejected'


message:string

}