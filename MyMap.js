class MyMap{
    constructor(iterable = []){
        if(typeof iterable[Symbol.iterator] !== 'function'){
            throw new TypeError(`你提供的${iterable}不是可迭代对象`)
        }
        this._data = []
        
        for (const item of iterable) {
            //item也是一个可迭代对象
            if(typeof item[Symbol.iterator] !== 'function' ){
                throw new TypeError(`你提供的${item}不是可迭代对象`)
            }

            const iterator = item[Symbol.iterator]()
            const key = iterator.next().value
            const value = iterator.next().value

            this.set(key,value)
        }
    }
    get(key){
        const item = this._getObj(key)
        if(item){
            return item.value
        }
        return undefined;
    }

    get size(){
        return this._data.length
    }

    delete(key){
        for (let i = 0; i < this._data.length; i++) {
            const element = this._data[i];
            if(this.isEqual(element.key,key)){
                this._data.splice(i,1)
                return true
            }
        }
        return false
    }

    clear(){
        this._data.length = 0;
    }

    set(key,value){
        const obj = this._getObj(key)
        if(obj !== undefined){
            obj.value = value

        }else{
            this._data.push({
                key,
                value
            })

        }
    }

    //根据key值从内部数据找到对应的数组项
    _getObj(key){
        for (const item of this._data) {
            if(this.isEqual(item.key,key)){
                return item
            }
        }
    }



    has(key){
        const item = this._getObj(key)
        return item !== undefined
      
    }

    isEqual(data1 , data2){
        if(data1 === 0 && data2 === 0){
            return true
        }
        return Object.is(data1,data2)
    }

    *[Symbol.iterator](){
        for (const item of this._data) {
            yield [item.key,item.value];
        }
    }

   forEach(callback){
       for (const item of this._data) {
           callback(item.value,item.key,this) 
       }
   }
}