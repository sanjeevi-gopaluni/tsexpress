import { Model, Document } from 'mongoose';
import { BaseModel } from './../models/base.model';

export abstract class BaseRepository<TModel extends BaseModel>{
  constructor(
    private mongooseModel: Model<TModel & Document>
  ) {

  }

  public findById(id: string): Promise<TModel> {
    return this.mongooseModel.findById(id).exec();
  }

  public findOne(conditions: Partial<TModel>): Promise<TModel> {
    return this.mongooseModel.findOne(conditions).exec();
  }

  public findMany(conditions: any): Promise<TModel[]> {
    return this.mongooseModel.find(conditions).exec();
  }

  public exists(conditions: Partial<TModel>): Promise<boolean> {
    return this.mongooseModel.exists(conditions);
  }

  public getAll(conditions?: Partial<TModel>, sort?: Partial<TModel>): Promise<TModel[]> {
    const query = this.mongooseModel.find(conditions);
    if (sort) {
      query.sort(sort);
    }
    return query.exec();
  }

  public async create(data: TModel): Promise<TModel> {
    const entity = new this.mongooseModel(data);
    const saved = await entity.save();
    return this.findById(saved._id);
  }

  public async update(id: string, data: TModel): Promise<TModel> {
    const saved = await this.mongooseModel.findByIdAndUpdate(id, data).exec();
    if (!saved) {
      return null;
    }
    return this.findById(saved._id);
  }

  public async delete(id: string): Promise<boolean> {
    const deleted = await this.mongooseModel.findByIdAndDelete(id).exec();
    return !!deleted;
  }
}
