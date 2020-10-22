const MyPromise = (() => {
    const PENDING = 'pending',
        RESOLVED = 'resolved',
        REJECTED = 'rejected',
        PromiseValue = Symbol('PromiseValue')//状态数据
    PromiseStatus = Symbol('PromiseStatus')
    thenables = Symbol('thenables')
    catchables = Symbol('catchables')
    changeStatus = Symbol('changeStatus')//当前状态
    settleHandler = Symbol('settleHandler')//后续处理通用函数
    linkPromise = Symbol('linkPromise')//创建串联的promise

    return class MyPromise {
        
        [changeStatus](newStatus, newValue, queue) {
            if (this[PromiseStatus] !== PENDING) {
                //状态无法变更
                return;
            }
            this[PromiseStatus] = newStatus;
            this[PromiseValue] = newValue;
            //执行相应队列中的函数
            queue.forEach(handler => handler(newValue));
        }

        //处理函数
        constructor(executor) {
            this[PromiseStatus] = PENDING;
            this[PromiseValue] = undefined;
            this[thenables] = [];//后续处理函数 resolved
            this[catchables] = [];//后续处理函数  rejected

            const resolve = data => {
                this[changeStatus](RESOLVED, data, this[thenables])
            }
            const reject = reason => {
                this[changeStatus](REJECTED, reason, this[catchables])

            }
            try {
                executor(resolve, reject)
            }
            catch (err) {
                reject(err)
            }
        }

        //后续处理函数、需要执行的状态、作业队列

    [settleHandler](handler, immediatelyStatus, queue) {
        console.log(queue)
        if (typeof handler !== "function") {
            return;
        }
        if (this[PromiseStatus] === immediatelyStatus) {
            //直接运行
            setTimeout(() => {
                handler(this[PromiveValue]);
            }, 0);
        }
        else {
            queue.push(handler);
        }
    }

    [linkPromise](thenalbe, catchable) {
        function exec(data, handler, resolve, reject) {
            try {
                const result = handler(data); //得到当前Promise的处理结果
                if (result instanceof MyPromise) {
                    result.then(d => {
                        resolve(d)
                    }, err => {
                        reject(err);
                    })
                }
                else {
                    resolve(result);
                }
            }
            catch (err) {
                reject(err);
            }
        }

        return new MyPromise((resolve, reject) => {
            this[settleHandler](data => {
                exec(data, thenalbe, resolve, reject);
            }, RESOLVED, this[thenables])

            this[settleHandler](reason => {
                exec(reason, catchable, resolve, reject);
            }, REJECTED, this[catchables])
        })
    }

    then(thenable, catchable) {
        return this[linkPromise](thenable, catchable);
    }

    catch(catchable) {

        return this[linkPromise](undefined, catchable);
    }

        static all(proms) {
            return new MyPromise((resolve, reject) => {
                const result = proms.map(p => {
                    const obj = {
                        result: undefined,
                        isResolved: false
                    }
                    p.then(data => {
                        obj.result = data;
                        obj.isResolved = true;
                        const unResolved = results.filter(r => !r.isResolved)
                        if (unResolved.length === 0) {
                            resolve(result.map(r => r.result))
                        }
                    },reason =>{
                        reject(reason)
                    })
                    return obj;
                })

                console.log(result)
            })


        }

        static race(proms) {
            return new MyPromise((resolve,reject) =>{
                proms.forEach( p=>{
                    p.then(data =>{
                        resolve(data)
                    },err =>{
                        reject(err)
                    })
                })
            })

        }

        static resolve(data) {
            if (data instanceof MyPromise) {
                return data
            } else {
                return new MyPromise(resolve => {
                    resolve(data)
                })
            }
        }

        static reject(reason) {
            return new MyPromise((resolve, reject) => {
                reject(reason)
            })
        }

    }
})()