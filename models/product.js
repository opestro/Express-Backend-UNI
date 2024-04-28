const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    nom: {type:String,
    required: true
},
    description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    images:[{
        type:String
    }],
    brand:{
        type:Number,
        default:0
    },
    categorie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    quantitéEnStock: {
        type:Number,
        required:true,
        min:0,
        max:255
    },
    notation:{
        type:Number,
        default:0
    },
    nombreDavis:{
        type:Number,
        default:0
    },
    estMisEnAvant:{
        type:Boolean,
        default:false
    },
    dateCreation:{
        type:Date,
        default:Date.now
    }
})

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON',{
    virtuals:true,
})



exports.Product = mongoose.model('Product' , productSchema);