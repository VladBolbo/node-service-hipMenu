import { Restaurant } from './../model/restaurant-model';

export class RestaurantController {

    //Restaurant
    public create(data: Object) {
        return Restaurant.create(data)
            .then(result => {
                return result;
            }) 
            .catch(err => {
                return err;
            });
    }

    public read(id: string) {
        const query: Object = { _id: id };

        return Restaurant.findOne(query)
            .then(result => {
                return result;
            }) 
            .catch(err => {
                return err;
            });
    } 

    public readAll() {
        return Restaurant.find()
            .then(result => {
                return result;
            }) 
            .catch(err => {
                return err;
            });
    }

    public update(id: string, data: Object) {
        const query: Object = { _id: id };

        return Restaurant.updateOne(query, data)
            .then(result => {
                return result;
            }) 
            .catch(err => {
                return err;
            });
    }

    public delete(id: string) {
        const query: Object = { _id: id };
        return Restaurant.findByIdAndDelete(query, {})
            .then(result => {
                return result;
            }) 
            .catch(err => {
                return err;
            });
    }

    public searchRestaurant(name: string) {
        const query: Object = { name: new RegExp(name, 'i') };

        return Restaurant.find(query)
            .then(result => {
                return result;
            }) 
            .catch(err => {
                return err;
            });
    }

    public sort() {
        return Restaurant.find().sort({name: 1} ).limit(50)
        .then(result => {
            return result;
        }) 
        .catch(err => {
            return err;
        });
    }

}
