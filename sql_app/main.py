from fastapi import FastAPI, HTTPException, Path, Query, Depends
from typing import Optional, List
from uuid import UUID
from . import crud, models, schemas
from .database import SessionLocal, engine
from sqlalchemy.orm import Session

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User APIs

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db=db, skip=skip, limit=limit)

# Todo APIs

@app.post("/users/{user_id}/todos/", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_todo(db=db, todo=todo, user_id=user_id)

@app.get("/todos/{todo_id}", response_model=schemas.Todo)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = crud.get_todo(db=db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.get("/todos/", response_model=List[schemas.Todo])
def read_todos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_todos(db=db, skip=skip, limit=limit)

@app.put("/users/{user_id}/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: int, user_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = crud.update_todo(db=db, user_id=user_id, todo_id=todo_id, todo=todo)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo

@app.delete("/users/{user_id}/todos/{todo_id}")
def delete_todo(todo_id: int, user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_todo(db=db, user_id=user_id, todo_id=todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully."}

@app.get("/user/{user_id}/todos/", response_model=List[schemas.Todo])
def read_todos_by_user_id(user_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_todos_by_user_id(db=db, user_id=user_id, skip=skip, limit=limit)

@app.get("/user/{user_id}/todos/{todo_id}", response_model=schemas.Todo)
def read_todo_by_user_id_and_todo_id(user_id: int, todo_id: int, db: Session = Depends(get_db)):
    db_todo = crud.get_todo_by_user_id_and_todo_id(db=db, user_id=user_id, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo