const fs = require("fs")
class Collection {
    constructor(defaultData = {}) {
        /**
         * @private
         */
        this.data = {}

        if (typeof defaultData === 'object') {
            Object.keys(defaultData).map((key) => this.set(key, defaultData[key]))
        }
    }

    /**
     * Get a value from the collection
     * @param {string} key The key where is located the data 
     * @returns 
     */
    get(key) {
        return this.data[key]
    }

    /**
     * Set a value in the collection
     * @param {string} key The key where is located the data 
     * @param {*} value The value to set
     */
    set(key, value) {
        this.data[key] = value
        return this
    }

    /**
     * Return true if the key exist or false if not
     * @param {string} key The key where is located the data
     * @returns 
     */
    has(key) {
        return Boolean(this.data[key])
    }

    /**
     * Get all values from the collection
     * @returns 
     */
    all() {
        return Object.keys(this.data).map((key) => {
            return {
                key,
                data: this.data[key]
            }
        })
    }

    /**
     * Checks if any of the elements exist in the collection
     * @param  {...any} keys The keys where the values are located
     * @returns 
     */
    hasAny(...keys) {
        return keys.some((k) => this.has(k))
    }

    /**
     * Get the first value present in the collection
     * @returns 
     */
    first() {
        return this.data[Object.keys(this.data)[0]]
    }

    /**
     * Get the first key present in the collection
     * @returns 
     */
    firstKey() {
        return Object.keys(this.data)[0]
    }

    /**
     * Get the last value present in the collection
     * @returns 
     */
    last() {
        return this.data[Object.keys(this.data)[Object.keys(this.data).length - 1]]
    }

    /**
     * Get the last key present in the collection
     * @returns 
     */
    lastKey() {
        return Object.keys(this.data)[Object.keys(this.data).length - 1]
    }

    /**
     * Returns the item at a given index, allowing for positive and negative integers.
     * Negative integers count back from the last item in the collection.
     * @param {number} number The index of the value to obtain
     * @returns 
     */
    at(number) {
        if (!number) number = 0
        number = Math.floor(number)
        let array = []
        Object.keys(this.data).map(k => array.push(k))
        let askedKey = array[number]
        if (typeof askedKey === 'undefined') return undefined
        else return this.data[askedKey]
    }

    /**
     * Returns the key at a given index, allowing for positive and negative integers.
     * Negative integers count back from the last item in the collection.
     * @param {number} number The index of the value to obtain
     * @returns 
     */
    keyAt(number) {
        if (!number) number = 0
        number = Math.floor(number)
        return Object.keys(this.data)[number] || undefined
    }

    /**
     * Obtain random value(s) from the collection
     * @param {number} number Number of random value(s) to obtain
     * @returns 
     */
    random(number) {
        if (!number || number < 0) number = 0
        let array = []
        Object.keys(this.data).map(k => array.push(k))
        if (!array || !array.length) return undefined
        else if (number === 0 || number === 1) return this.data[array[Math.floor(Math.random() * array.length)]]
        else {
            let result = []
            for (let i = 0; i < number; ++i) {
                result.push(this.data[array[Math.floor(Math.random() * array.length)]])
                if (i === number) return result
            }
        }
    }

    /**
     * Obtain random key(s) from the collection
     * @param {number} number Number of random key(s) to obtain
     * @returns 
     */
    randomKey(number) {
        if (!number || number < 0) number = 0
        let array = []
        Object.keys(this.data).map(k => array.push(k))
        if (!array || !array.length) return undefined
        else if (number === 0 || number === 1) return array[Math.floor(Math.random() * array.length)]
        else {
            let result = []
            for (let i = 0; i < number; ++i) {
                result.push(array[Math.floor(Math.random() * array.length)])
                if (i === number) return result
            }
        }
    }

    /**
     * Clear the collection
     */
    clear() {
        this.data = {}
        return this
    }

    /**
     * Reverse all datas, the first will be the last and the last will be the first (and etc for other positions)
     * @example 
     * console.log(collection.all()) // [{key: 'firstPlace', data: 1}, {key: 'secondPlace', data: 2}]
     * collection.reverse()
     * console.log(collection.all()) // [{key: 'secondPlace', data: 2}, {key: 'firstPlace', data: 1}]
     * @returns 
     */
    reverse() {
        const entries = [...this.all()].reverse()
        this.clear()
        entries.map(v => this.set(v.key, v.data))
        return this
    }

    /**
     * Find a value(s) from the collection
     * @param {*} fn 
     * @param {boolean} complete return a complete object with the data find and his key
     * @example
     * console.log(collection.all()) // [{key: 'thisOne', data: 'hello'}, {key: 'thisOneToo', data: 'hello'}, {key: 'notThisOne', data: 'bye'}]
     * console.log(collection.find(v => v === 'hello')) // ['hello', 'hello']
     * console.log(collection.find(v=> v === 'hello', true)) // [{key: 'thisOne', data: 'hello'}, {key: 'thisOneToo', data: 'hello'}]
     * @returns 
     */
    find(fn, complete) {
        if (!fn) return undefined
        let array = [...this.all()]
        if (!array || array.length < 1) return []
        let result = []
        array.map(data => {
            let util = [data.data]
            if (!util) return
            if (util.find(fn)) result.push(complete ? data : data.data)
        })
        if (result.length < 1) return []
        else if (result.length < 2) return [result[0]]
        else return result
    }

    /**
     * Find one value from the collection
     * @param {*} fn 
     * @param {boolean} complete return a complete object with the data find and his key
     * @example
     * console.log(collection.all()) // [{key: 'thisOne', data: 'hello'}, {key: 'notThisOne', data: 'bye'}]
     * console.log(collection.findOne(v => v === 'hello')) // 'hello'
     * console.log(collection.findOne(v=> v === 'hello', true)) // [{key: 'thisOne', data: 'hello'}]
     * @returns 
     */
    findOne(fn, complete) {
        if (!fn) return undefined
        let array = [...this.all()]
        if (!array || array.length < 1) return undefined
        let result = []
        array.map(data => {
            let util = [data.data]
            if (!util) return
            if (util.find(fn)) result.push(complete ? data : data.data)
        })
        if (result.length < 1) return undefined
        else return result[0]
    }

    /**
     * Get a new collection with data filter
     * @param {*} fn 
     * @example
     * collection.set('example1', 1)
     * collection.set('example2', 2)
     * collection.set('example3', 3)
     * console.log(collection.all()) // [{key: 'example1', data: 1}, {key: 'example2', data: 2}, {key: 'example3', data: 3}]
     * let all = collection.filter(v=>v<3)
     * console.log(all) // [{key: 'example1', data: 1}, {key: 'example2', data: 2}]
     * @returns {Collection}
     */
    filter(fn) {
        if (!fn) return this
        let array = [...this.all()]
        if (!array || array.length < 1) return this
        let result = []
        array.map(data => {
            let util = [data.data]
            util = util.filter(fn)
            if (util.length > 0) result.push(data)
        })
        let val = new Collection()
        result.map(r => val.set(r.key, r.data))
        return val
    }

    /**
     * Delete a data present in the collection
     * @param {string} key The key where the data is located
     * @example 
     * collection.set('example', 1)
     * console.log(collection.get('example')) // 1
     * collection.delete('example')
     * console.log(collection.get('example')) // undefined
     * @returns 
     */
    delete(key) {
        delete this.data[key]
        return this
    }

    /**
     * Checks if there exists an item that passes a test
     * @param {*} fn 
     * @example 
     * collection.set('example', 2)
     * let test = collection.some(data => data === 2)
     * console.log(test) // true 
     * @returns 
     */
    some(fn) {
        let r = this.find(fn)
        if (typeof r === 'undefined') return false
        else return true
    }

    /**
     * Get all data from the collection
     * @param {*} fn 
     * @example
     * collection
     *  .forEach(data => console.log(data))
     * ---------------------------------------
     * collection
     *  .filter(data => data < 2)
     *      .forEach(data => console.log(data))
     * @returns 
     */
    forEach(fn) {
        if (!fn) throw new TypeError("The function can't be undefined in a 'forEach'")
        let t = new Map()
        this.all().map(v => t.set(v.key, v.data))
        return t.forEach(fn)
    }

    /**
     * Get all data from the collection
     * @param {*} fn 
     * @example
     * collection
     *  .map(data => console.log(data))
     * ---------------------------------------
     * collection
     *  .filter(data => data < 2)
     *      .map(data => console.log(data))
     * @returns 
     */
    map(fn) {
        if (!fn) throw new TypeError("The function can't be unefined in a 'map'")
        let array = [...this.all().map(v => v.data)]
        return array.map(fn)
    }

    /**
     * Create a clone of this collection, a perfect copy
     * @example
     * const newCollection = oldCollection.clone()
     * @returns 
     */
    clone() {
        let collection = new Collection(this.data)
        return collection
    }

    /**
     * The sort method sorts the items of a collection in place and returns it
     * The sort is not necessarily stable in Node 10 or older
     * The default sort order is according to string Unicode code points
     * @param {*} fn 
     * @param {boolean} onlyData Return the key and the data
     * @example
     * console.log(collection.all()) // [{key: 'test1', data: 2}, {key: 'test2', data: 1}]
     * console.log(collection.sort((a, b) => a - b)) // [1, 2]
     * console.log(collection.sort((a, b) => a.data - b.data, true)) // [{key: 'test2', data: 1}, {key: 'test1', data: 2}]
     * @returns 
     */
    sort(fn, onlyData) {
        if (!fn) throw new TypeError("The function can't be unefined in a 'sort'")
        let array = onlyData ? [...this.all().map(v => v.data)] : [...this.all()]
        return array.sort(fn)
    }

    /**
     * Return a new collection with items where the key is present in one collection but not the other
     * @param {Collection} otherCollection 
     */
    difference(otherCollection) {
        if (typeof otherCollection !== typeof this) throw new TypeError("The argument given is not a collection")
        let array = [...this.all()]
        let other = [...otherCollection.all()]
        let finalCollection = new Collection()
        for (const { key, data } of other) {
            if (!this.has(key)) finalCollection.set(key, data)
        }
        for (const { key, data } of array) {
            if (!otherCollection.has(key)) finalCollection.set(key, data)
        }
        return finalCollection
    }

    /**
     * Return the collection with JSON format
     * @returns 
     */
    toJSON() {
        return JSON.stringify(this.data, null, 2)
    }

    /**
     * Return the size of the collection
     * @returns {number}
     */
    size() {
        let array = [...this.all()]
        return array.length
    }

    

    /**
     * Returns a copy of a section of an array. For both start and end, a negative index can be used to indicate an offset from the end of the array. For example, -2 refers to the second to last element of the array
     * @param {number} start The beginning index of the specified portion of the array. If start is undefined, then the slice begins at index 0
     * @param {number} end The end index of the specified portion of the array. This is exclusive of the element at the index 'end'. If end is undefined, then the slice extends to the end of the array
     * @returns
     */
    slice(start, end) {
        if (!start) start = 0
        let array = [...this.all()]
        if (!end) end = array.length
        let newArray = array.slice(start, end)
        let newCollection = new Collection()
        newArray.map(d => newCollection.set(d.key, d.data))
        return newCollection
    }

    /**
     * Get an array with all keys
     * @returns 
     */
    keys() {
        return Object.keys(this.data)
    }

    /**
     * Get an array with all values
     * @returns 
     */
    values() {
        let array = [...this.all().map(v => v.data)]
        return array
    }

    /**
     * Return all keys and values in a object
     * @returns 
     */
    toObject() {
        return this.data
    }

    /**
     * Get all keys and values in a array
     * @deprecated This function is deprecated and will be deleted in next version, use .toArray() or .all()
     * @returns 
     */
    array() {
        let final = []
        if(this.size < 1) return []
        if(Object.keys(this.data).length < 1) return []
        Object.keys(this.data).map((key) => {
            let all = {}
            if (!this.data[key]) return
            if (typeof this.data[key] === 'undefined') return
            if (this.data[key]) all[key] = this.data[key]
            final.push(all)
        })
        return final
    }

    /**
     * Get all keys and values in a array
     */
    toArray(){
        let final = []
        if(!this.data) return []
        Object.keys(this.data).map((key)=>{
            let all = {}
            all[key] = this.data[key]
            final.push(all)
        })
        return final
    }

    /**
     * Combines this collection with others into a new collection. None of the source collections are modified
     * @param {Collection} otherCollection 
     */
    combine(otherCollection){
        const newCollection = this.clone()
        let other = [...otherCollection.all()]
        for (const { key, data } of other) {
            newCollection.set(key, data)
        }
        return newCollection
    }

    /**
     * Save the collection data in a json file
     * @param {string} path File path where the data will be stored
     * @returns 
     */
    save(path){
        if(!path) path = `./saveCollection_${this.size()}.json`
        if(!path.endsWith('.json')) path += '.json'
        fs.writeFileSync(path, this.toJSON(), 'utf-8')
        return this
    }

    /**
     * Get data from a json file and set the collection with it
     * @param {string} path The path where the data is stored 
     * @returns 
     */
    getSave(path){
        if(!path) throw new TypeError("The path can't be undefined")
        if(!fs.existsSync(path)) throw new TypeError("The path is not valid")
        if(!path.endsWith('.json')) path += '.json'
        const savedData = JSON.parse(fs.readFileSync(path))
        if(typeof savedData === "object"){
            this.data = savedData
        }
        return this
    }

    /**
     * Add a number to the data
     * @param {string} key The key where the data is located
     * @param {number} count How many will be added to the value
     * @returns 
     */
    add(key, count){
        if(!count) count = 0
        if(isNaN(count)) throw new TypeError("The value is NaN")
        if(!this.data[key]) this.data[key] = 0
        if(isNaN(this.data[key])) throw new TypeError("The current value in the collection is NaN")
        this.data[key] += count
        return this
    }

    /**
     * Subtract a number to the data
     * @param {string} key The key where the data is located
     * @param {number} count How many will be removed to the value
     * @returns 
     */
    subtract(key, count){
        if(!count) count = 0
        if(isNaN(count)) throw new TypeError("The value is NaN")
        if(!this.data[key]) this.data[key] = 0
        if(isNaN(this.data[key])) throw new TypeError("The current value in the collection is NaN")
        this.data[key] -= count
        return this
    }

    /**
     * Add a value in an array
     * @param {string} key The key where the data is located 
     * @param {*} element The element to add in the array
     * @returns 
     */
    push(key, element){
        if(!element) throw new TypeError("The value can't be undefined")
        if(!this.data[key]) this.data[key] = []
        if(typeof this.data[key] !== 'object') throw new TypeError("The current value is not an array")
        this.data[key].push(element)
        return this
    }

    /**
     * Remove a value from an array
     * @param {string} key The key where the data is located 
     * @param {*} element The element to remove from the array
     * @returns 
     */
    remove(key, element){
        if(!element) throw new TypeError("The value to remove can't be undefined")
        if(!this.data[key]) return this
        if(typeof this.data[key] !== 'object') throw new TypeError("The current value is not an array")
        this.data[key] = this.data[key].filter(v=>v!==element)
        return this
    }
}

module.exports.Collection = Collection