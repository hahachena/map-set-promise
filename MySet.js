class MySet{
    constructor(iterator = []){
        //验证是否为可迭代对象
        if(typeof iterator[Symbol.iterator] !== 'function'){
            throw new TypeError(`你提供的${iterator}不是一个可迭代对象`)

        }
        this._data = []

        for (const item of iterator) {
            this.add(item);
        }
    }

    add(data) {
        if(!this.has(data)){
            this._data.push(data)
        }
    }

    delete(data){
        for (let index = 0; index < this._data.length; index++) {
            const element = this._data[index];
            if(this.isEqual(element,data)){
                this._data.splice(index,1)
                return true
            }
        }
        return false

    }

    clear(data){
        this._data.length = 0

    }

    has(data){
        for (const item of this._data) {
            if(this.isEqual(data,item)){
                return true;
            }
        }
        return false
    }

    *[Symbol.iterator](){
        for (const iterator of this._data) {
            yield iterator;
        }
    }

    forEach(callback){
        for (const iterator of this._data) {
            callback(iterator,iterator,this)
        }
    }



    //判断两个数据是否相等

    isEqual(data1,data2){
        if(data1 === 0 && data2 ===0){
            return true
        }else{
            return Object.is(data1,data2)
        }   
    }


}