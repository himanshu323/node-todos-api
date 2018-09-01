const request=require("supertest");
const expect=require("expect")
const {ObjectID}=require("mongodb")

let {app}=require("../server")
let {Todo}=require("../models/todos")
let {todos,users,populateTodosData,populateUsers}=require("./seed/server.seed")
let {User}=require("../models/users");



describe("Test the Todos App",()=>{


    beforeEach(populateTodosData);

    beforeEach(populateUsers);
    

    it("test the post /todos when user submits text",(done)=>{

        let text="Testing"
        request(app).post("/todos")
        .set("x-auth",users[0].tokens[0].token)
        .send({text})
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

        request(app).post("/todos").
        set("x-auth",users[0].tokens[0].token).
        send({})
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
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .expect((resp)=>{
            expect(resp.body.todos.length).toBe(1);
            expect(resp.body.todos[0]).toInclude(todos[0]);
        })
        .end(done);
    })

    describe("Test the GET /todos/:id",(done)=>{

        it("when user submits a valid todo ID found in collection",(done)=>{

                request(app).
                
                get(`/todos/${todos[0]._id.toHexString()}`)
                .set("x-auth",users[0].tokens[0].token)
                .expect(200)
                .expect((resp)=>{
                    expect(resp.body.todo.text).toBe(todos[0].text);
                })
                .end(done)
        })

        it("When user submits an invalid id",(done)=>{

            request(app)
            
            .get("/todos/321")
            .set("x-auth",users[1].tokens[0].token)
            .expect(400)
            .end(done);
        })


        it("when user submits id not found in collection",(done)=>{

            request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth",users[0].tokens[0].token)
            .expect(404)
            .end(done);
        })

        it("when user retirves id not have access to",(done)=>{
            request(app).
                
            get(`/todos/${todos[0]._id.toHexString()}`)
            .set("x-auth",users[1].tokens[0].token)
            .expect(404)
            
            .end(done)

        })
     })

     describe("Test the Delete Todos :id",()=>{

        it("when user submits a valid todo ID",(done)=>{
            let hexId=todos[0]._id.toHexString();
            request(app)
            .delete(`/todos/${hexId}`)
            .set("x-auth",users[0].tokens[0].token)
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todo._id.toString()).toBe(todos[0]._id.toHexString());
                
                
            })
            .end((err,resp)=>{
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((res)=>{
                    expect(res).toNotExist();
                    done();
                }).catch((e)=>done(e))
            })
            
        })

        it("Submits an invalid id",(done)=>{
            request(app)

            .delete("/todos/321")
            .set("x-auth",users[1].tokens[0].token)
            .expect(400)
            .end(done);
        })

        it("Submits a id not in collection",(done)=>{
            request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth",users[1].tokens[0].token)
            .expect(404)
            .end(done);
        })

        it("when tries to delete todo not aceess to",(done)=>{


            let hexId=todos[0]._id.toHexString();
            request(app)
            .delete(`/todos/${hexId}`)
            .set("x-auth",users[1].tokens[0].token)
            .expect(404)
           
            .end((err,resp)=>{
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((res)=>{
                    expect(res).toExist();
                    done();
                }).catch((e)=>done(e))
            })

        })


     })

     describe("Test the Update Todos:id",()=>{

        it("User updates the record for valid id with completed as true",(done)=>{
            let text="Bye Bye"
            let completed=true;
            let hexId=todos[0]._id.toHexString();
            request(app)
            .patch(`/todos/${hexId}`)
            .set("x-auth",users[0].tokens[0].token)
            .send({text,completed})
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todo.text).toBe(text);
                expect(resp.body.todo.completed).toBe(completed);
                expect(resp.body.todo.completedAt).toBeA('number');
            })
            .end(done);
        })

        it("User updates the record for valid id with completed as false",(done)=>{
            let text="World"
            let completed=false;
            let hexId=todos[1]._id.toHexString();
            request(app)
            .patch(`/todos/${hexId}`)
            .set("x-auth",users[1].tokens[0].token)
            .send({text,completed})
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.todo.text).toBe(text);
                expect(resp.body.todo.completed).toBe(completed);
                expect(resp.body.todo.completedAt).toNotExist();
            })
            .end(done);
        })

        it("User tries to update todo not having access to",(done)=>{

            let text="Bye Bye"
            let completed=true;
            let hexId=todos[0]._id.toHexString();
            request(app)
            .patch(`/todos/${hexId}`)
            .set("x-auth",users[1].tokens[0].token)
            .send({text,completed})
            .expect(404)
        
            .end(done);

        })
     })

     describe("Test the Get /Users/me",()=>{

        it("when user passes a valid token",(done)=>{

            request(app).
            get("/users/me").
            set("x-auth",users[0].tokens[0].token).
            expect(200).expect((resp)=>{

                expect(resp.body._id).toBe(users[0]._id.toHexString());
                expect(resp.body.email).toBe(users[0].email);
            })
            .end(done);
        })

        it("when user doesn't provide a token",(done)=>{
            request(app).
            get("/users/me")
            .expect(401)
            .expect((resp)=>{
                expect(resp.body).toEqual({});
            })
            .end(done)
        })
     })

     describe("Post Users Signup Up",()=>{

        it("when user passes valid data and token gets gen",(done)=>{

            let email="abc@test.com";
            let password="testjjj";
            request(app)
            .post("/users").
            send({email,password})
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.email).toBe(email);
                expect(resp.body._id).toExist();
                expect(resp.headers['x-auth']).toExist();
            })
            .end((err)=>{
                
                if(err){
                    return done(err);
                }
                    User.findOne({email}).then((resp)=>{

                        expect(resp).toExist();
                        expect(resp.email).toBe(email);
                        expect(resp.password).toNotBe(password);
                       
                        done();
                        
                    })
                    .catch((err)=>{
                        done(err);
                    })
                })
            })

            it("when user passes invalid data",(done)=>{
                let email="lkhl.com"
                let password="ede"
                request(app)
                .post("/users")
                .send({email,password})
                .expect(400)
                .end(done);
            })

            it("when user passes duplicate email id",(done)=>{

                request(app)
                .post("/users")
                .send({email:users[1].email,password:"lkjkljlk"})
                .expect(400)
                .end(done);
            })

        })

        describe("POST /users/login",()=>{

            it("When user enters valid login and gets token back",(done)=>{


                request(app)
                .post("/users/login")
                .send({
                    email:users[1].email,
                    password:users[1].password
                })
                .expect(200)
                .expect((resp)=>{
                    expect(resp.headers['x-auth']).toExist();
                    expect(resp.body.email).toBe(users[1].email);
                })
                .end((err,resp)=>{

                    if(err){
                        return done(err);
                    }

                    User.findById(users[1]._id).then((res)=>{
                        expect(res.tokens[1].token).toBe(resp.headers['x-auth']);
                        done();
                    }).catch((e)=>{
                        done(e);
                    })
                })
            })

           

            it("when used entersd invalid login",(done)=>
            {
                request(app).
                post("/users/login")
                .send({
                    email:users[1].email,
                    password:"kljkljl"
                }).
                expect(400)
                .expect((resp)=>{
                    expect(resp.headers['x-auth']).toNotExist();
                    
                })
                .end((err,resp)=>{

                    if(err){
                        return done(err);
                    }

                    User.findById(users[1]._id).then((res)=>{
                        expect(res.tokens.length).toBe(1);
                        done();
                    }).catch((e)=>{
                        done(e);
                    })
                })
                

            })
    })

    describe("Delete /users/me/token",()=>{


        it("when user is authenticated for logoiut",(done)=>{


            request(app)
            .delete("/users/me/token")
            .set("x-auth",users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end((err,res)=>{
                if(err){
                    return done(err)
                }

                User.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>{
                    done(e);
                })
            })
        })
    })

     })


