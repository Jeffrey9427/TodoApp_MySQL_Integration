from sqlalchemy.orm import Session
from . import models, schemas

# Users CRUD operations

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_pass = user.password + "examplehash"
    db_user = models.User(email=user.email, username=user.username, hashed_password=fake_hashed_pass, profileURL=user.profileURL)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        for key, value in user.dict().items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False


# Todos CRUD operations

def create_todo(db: Session, todo: schemas.TodoCreate, user_id: int):
    db_todo = models.Todo(**todo.dict(), user_id=user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def get_todo(db: Session, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()

def get_todos(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Todo).offset(skip).limit(limit).all()

def update_todo(db: Session, user_id: int, todo_id: int, todo: schemas.TodoCreate):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.user_id == user_id).first()
    if db_todo:
        for key, value in todo.dict().items():
            setattr(db_todo, key, value)
        db.commit()
        db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, user_id: int, todo_id: int):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.user_id == user_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
        return True
    return False

def get_todos_by_user_id(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return db.query(models.Todo).filter(models.Todo.user_id == user_id).offset(skip).limit(limit).all()

def get_todo_by_user_id_and_todo_id(db: Session, user_id: int, todo_id: int):
    return db.query(models.Todo).filter(models.Todo.user_id == user_id, models.Todo.id == todo_id).first()