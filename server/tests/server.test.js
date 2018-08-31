const request=require("supertest");
const expect=require("expect")
const {ObjectID}=require("mongodb")

let {app}=require("../server")
let {Todo}=require("../models/todos")

let todos=[{
    _id:new ObjectID(),
    text:"Complete Angular"
},{
    _id:new ObjectID(),
    text:"Complete NodeJS"
}]


describe("Test the Todos App",()=>{


    beforeEach((done)=>{

        Todo.remove({}).then(()=>{
           return Todo.insertMany(todos)
        }).then(()=>{
            done();
        })
    })
    

    it("test the post /todos when user submits text",(done)=>{

        let text="Testing"
        request(app).post("/todos").send({text})
        .expect(200)
        .expect((resp)=>{
            expect(resp.body.text).toBe(text);
            console.log(resp.body.text)
        })
        .end((error,resp)=>{

            if(error){
                return done(error);
            }
           // expect(resp.body.text).toBe(text+"aw");
            Todo.find({text}).then((resp)=>{
                console.log(resp.length)
                console.log("Inside")
                expect(resp.length).toBe(1);
                console.log("Length",resp.length)
                console.log(resp.length)
                expect(resp[0].text).toBe(text);
                done();
            })
            .catch((e)=>{
               return done(e);
            })

        })
    })


    it("Testing POST /todos when user enters invalid text",(done)=>{

        request(app).post("/todos").send({})
        .expect(400).
        end((error,resp)=>{
            if(error){
                return done(error);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>{
                return done(e);
            })
        })
    })

    it("Test the Get /Todos",(done)=>{

        request(app).get("/todos")
        .expect(200)
        .expect((resp)=>{
            expect(resp.body.todos.length).toBe(2);
            expect(resp.body.todos[0]).toInclude(todos[0]);
        })
        .end(done);
    })

    describe("Test the GET /todos/:id",(done)=>{

        it("when user submits a valid todo ID found in collection",(done)=>{

                request(app).
                get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((resp)=>{
                    expect(resp.body.todo.text).toBe(todos[0].text);
                })
                .end(done)
        })

        it("When user submits an invalid id",(done)=>{

            request(app)
            .get("/todos/321")
            .expect(400)
            .end(done);
        })


        it("when user submits id not found in collection",(done)=>{

            request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
        })
     })
})
