/**
 * Created by harsh on 17/5/18.
 */
'use strict';

function saveData(model,data) {
    return new Promise((resolve, reject) => {
        try {
            let saveData = model.create(data);
            return resolve(saveData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getData(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}



function getDataOne(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.findOne(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getUniqueData(model,keyName,query, options) {
    return new Promise((resolve, reject) => {
        try {
            let getUniqueData = model.distinct(keyName, query, options);
            return resolve(getUniqueData);
        } catch (err) {
            return reject(err);
        }
    });
}




function findAndUpdate(model, conditions, update, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.findOneAndUpdate(conditions, update, options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function update(model, conditions, update, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.update(conditions, update, options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function remove(model, condition) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.deleteMany(condition);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function remove1(model, condition) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.deleteOne(condition);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function populateData(model, query, projection, options, collectionOptions) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.find(query, projection, options).populate(collectionOptions).exec();
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}




async function deepPopulateData(model, query, projection, options, collectionOptions,populateOptions) {

        try {
            let data = await model.find(query, projection, options).populate(collectionOptions).exec();
            // console.log("=======data===========",data[0].favourites)
            let populateData = await model.populate(data,populateOptions);
            return (populateData);
        }
        catch (err) {
            return err;
        }
}

function count(model, condition) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.count(condition);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function aggregateData(model, group,options) {
    return new Promise((resolve, reject) => {
        try {
            let data;

            if(options !==undefined){
                data = model.aggregate(group).option(options);
            }
            else{
                data = model.aggregate(group);
            }

            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function insert(model, data, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.collection.insert(data,options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

function insertMany(model, insert, options) {
    return new Promise((resolve, reject) => {
        try {
            let data = model.collection.insertMany(insert,options);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
}

let bulkFindAndUpdate= (bulk,query,update,options)=> {
    bulk.find(query).upsert().update(update,options);
};

let bulkFindAndUpdateOne= (bulk,query,update,options)=> {
    bulk.find(query).upsert().updateOne(update,options);
};

async function aggregateDataWithPopulate(model, group, populateOptions,options) {
    try {
        // console.log("========options==========",options)
        let aggregateData;
        if(options !==undefined){
            aggregateData = await model.aggregate(group).option(options);
        }
        else{
            aggregateData = await model.aggregate(group);
        }
        // console.log("=========aggregateData============",aggregateData.length)
        let populateData = await model.populate(aggregateData,populateOptions);
        
        
        // console.log("=======populateData===========",populateData.length)
        return populateData;
    } catch (err) {
        return err;
    }
}

module.exports = {
    saveData : saveData,
    getData : getData,
    getDataOne : getDataOne,
    update : update,
    remove: remove,
    remove1: remove1,
    insert: insert,
    insertMany: insertMany,
    getUniqueData : getUniqueData,
    count: count,
    findAndUpdate : findAndUpdate,
    populateData : populateData,
    aggregateData : aggregateData,
    aggregateDataWithPopulate: aggregateDataWithPopulate,
    bulkFindAndUpdate : bulkFindAndUpdate,
    deepPopulateData:deepPopulateData,
    bulkFindAndUpdateOne : bulkFindAndUpdateOne,
 
};