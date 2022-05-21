CREATE SEQUENCE usuario_id_seq; 
CREATE TABLE public.usuario ( 
    id int NOT NULL DEFAULT nextval('usuario_id_seq'), 
    nome varchar(200) NOT NULL, 
    email varchar(100) NOT NULL, 
    login varchar(100) NOT NULL, 
    senha varchar(100) NOT NULL, 
    roles varchar (200)  NOT NULL DEFAULT 'USER', 
    CONSTRAINT usuario_pk PRIMARY KEY (id) 
);

INSERT INTO usuario (nome, login, senha, email, roles) 
    VALUES('user', 'user', 
'$2a$08$cgWo0k133AqN7bfHTkKK8eedZRBlpZL08piXXQP521KOFXIF4sWha', 
'user@abc.com.br', 'USER'); 
INSERT INTO usuario (nome, login, senha, email, roles) 
    VALUES('admin', 'admin', 
'$2a$08$cgWo0k133AqN7bfHTkKK8eedZRBlpZL08piXXQP521KOFXIF4sWha', 
'admini@abc.com.br', 'USER;ADMIN'); 