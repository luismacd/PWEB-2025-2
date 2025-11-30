class RepositoryBase {
    constructor(model) {
        this.model = model;
    }

    async findAll() {
        try {
            return await this.model.findAll();
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async create(entity) {
        try {
            return await this.model.create(entity);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async findById(id) {
        try {
            return await this.model.findOne({
                where: { id }
            });
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update(id, entity) {
        try {
            return await this.model.update(entity, {
                where: { id }
            })
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async delete(id) {
        try {
            return await this.model.destroy({
                where: { id }
            })
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default RepositoryBase;
