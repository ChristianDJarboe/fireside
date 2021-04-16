export default {
    user:{
        account_name: "",
        age: null,
        bio: "",
        id: null,
        job: "",
        location: "",
        proper_name: null,
        school: "",
        sin_alch: "",
        sin_nicc: "",
        sin_weed: "",
    },
    userImages:[],
    /*
    {
        user_id: INT,
        ref: STRING,
    }
     */
    friends:[],
        /*
    {
        id:INT, //USED AS THREAD_ID when getting threads in msgs page
        user_id: INT,
        account_name: STRING,
        proper_name: STRING,
        profile_pic_ref:STRING
    }
     */
    friendRequests:[],
    /*
    {
        id:INT,
        requester_account_name: STRING,
        requester_proper_name: STRING,
        requester_profile_pic_ref: STRING,
        requester: INT, //THE PERSON WHO SENT THE REQUEST
        requestee: INT  //THE PERSON RECIEVING THE REQUEST
    }
    */
    sentFriendRequests:[],
    /*
    {
        id: INT,
        requester: INT, //THE PERSON WHO SENT THE REQUEST
        requestee: INT  //THE PERSON RECIEVING THE REQUEST
        requestee_account_name: STRING,
        requestee_proper_name: STRING,
        requestee_profile_pic_ref: STRING,
    }
    */
    hostedFireside:{
     fireside:{
         location_address:""
     }
    },
    /*
    {
        id:INT,
        vibe: STRING,
        location: STRING,
        allow_public: BOOLEAN,
        allow_friends: BOOLEAN,
    }
    */
    firesides:[],
    /*
    {
        id:INT,
        vibe: STRING,
        location: STRING,
        attendees:[],
        invited:[],
    }
    */
    firesideInvites:[],
    /*
    {
        id: INT,
        user_id: INT,
        fireside_id: INT,
        vibe: STRING,
        location: STRING,
        host_account_name: STRING,
        host_proper_name: STRING
    }
    */
   sentFiresideInvites:[],
    /*
    {
        id: INT,
        user_id: INT,
        fireside_id: INT,
        user_account_name: STRING,
        user_proper_name: STRING,
        user_profile_pic_ref: STRING
    }
    */
  };
  