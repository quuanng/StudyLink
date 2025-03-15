import mongoose from "mongoose"

const ClassSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  catalog_number: { type: String, required: true},
  full_name: { type: String, required: true},
  descr: { type: String, required: true},
  count: { type: Number, required: true},
  saves: { type: Number, required: true },
  //studyGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" }]
})

export const ClassModel = mongoose.model("Class", ClassSchema)
