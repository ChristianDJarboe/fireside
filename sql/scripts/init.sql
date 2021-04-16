DROP TABLE IF EXISTS usersCredentials, user_profile, messages, invites, attendance, friend_requests, friends, images, users,firesides;

create table users(
	id INT NOT NULL AUTO_INCREMENT,
    account_name varchar(128),
    proper_name varchar(128),
    age int,
    primary key(id)
);
create table user_profile(
	id INT NOT NULL AUTO_INCREMENT,
    user_id int,
	profile_pic_ref varchar(256),
    bio varchar(512),
    location varchar(64),
    job varchar(64),
    school varchar(64),
    sin_weed bool,
    sin_alch bool,
    sin_nicc bool,
    primary key(id),
    foreign key (user_id) references users(id)
);
create table friends(
	id INT NOT NULL AUTO_INCREMENT,
    user_1_id int,
    user_2_id int,
    insert_date TIMESTAMP NOT NULL default current_timestamp,
	primary key(id)
);
create table messages(
	id INT NOT NULL AUTO_INCREMENT,
	sender_accName varchar(128),
    sender_id int,
    thread_id int,
    img_ref varchar(256),
    message varchar(512),
    insert_date TIMESTAMP NOT NULL default current_timestamp,
    primary key(id),
    foreign key (thread_id) references friends(id)
);
create table firesides(
	id INT NOT NULL AUTO_INCREMENT,
	user_id int,
    vibe varchar(256),
    location_address varchar(256),
    lat varchar(32),
    lng varchar(32),
    allow_friends bool,
    allow_public bool,
    primary key(id),
    foreign key (user_id) references users(id)
);
create table invites(
	id INT NOT NULL AUTO_INCREMENT,
    user_id int,
    fireside_id int,
	primary key(id),
    foreign key (user_id) references users(id),
    foreign key (fireside_id) references users(id)
);
create table attendance(
	id INT NOT NULL AUTO_INCREMENT,
    user_id int,
    fireside_id int,
	primary key(id),
    foreign key (user_id) references users(id),
    foreign key (fireside_id) references users(id)
);

create table friend_requests(
	id INT NOT NULL AUTO_INCREMENT,
    requester int,
    requestee int,
	primary key(id)
);



create table images(
	id INT NOT NULL AUTO_INCREMENT,
    user_id int,
	ref varchar(256),
	primary key(id)
);

create table usersCredentials(
	id INT NOT NULL AUTO_INCREMENT,
    user_ID int,
    password varchar(256),
    email varchar(256),
	primary key(id),
    foreign key (user_id) references users(id)
);
