GRANT ALL PRIVILEGES ON devdb.* TO devuser@localhost
 IDENTIFIED BY 'devpass' WITH GRANT OPTION;

create database devdb;

create table devdb.board (
  id int not null auto_increment primary key,
  name varchar(50),
  email varchar(100),
  message text);

insert into devdb.board (name, email, message) 
values ('kenu', 'kenu.heo@gmail.com', '게시판 내용입니다.');
