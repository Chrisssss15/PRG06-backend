import mongoose from 'mongoose';



const tokenSchema = new mongoose.Schema({
    nameToken: {type: String, required: true},
    tigger: {type: String, required: true},
    adress: {type: String, required: true},
    favorite: {type: Boolean, default: false}, // Nieuw veld
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {

            ret._links = {
                self: {
                    href: `${process.env.BASE_URL}/tokens/${ret._id}`
                },
                collection: {
                    href: `${process.env.BASE_URL}/tokens`
                }
            }

            delete ret._id
        }
    }
});
export default mongoose.model('Token', tokenSchema);