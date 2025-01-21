import mongoose from 'mongoose';



const noteSchema = new mongoose.Schema({
    nameToken: {type: String, required: true},
    tigger: {type: String, required: true},
    adres: {type: String, required: true},
    imgURL: {type: String, required: true},
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
export default mongoose.model('Note', noteSchema);