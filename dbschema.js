//here we write how our data is gonna look like
let db = {
    users: [
        {
            userId: '3uqsMEJJXIae3pn7gHBxJKB1ljx1',
            email: 'user@mail.com',
            handle: 'user',
            createdAt: '2021-02-20T12:05:06.387Z',
            imageUrl: 'image/sdafdsaf/adsafsd,',
            bio: 'I am user of social network',
            website: 'user.com',
            location: 'Monte, UA'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2021-02-20T11:08:06.951Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'df4231gfdw143rg43r4',
            body: 'nice hat!',
            createdAt: '2021-02-20T11:08:06.951Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'john',
            read: 'true | false',
            screamId: '123fs4rtg543rfffq41',
            type: 'like | comment',
            createdAt: '2021-02-20T11:08:06.951Z'
        }
    ]
}

const userDetails = {
    // Redux data looks like
    credentials: {
        userId: '3uqsMEJJXIae3pn7gHBxJKB1ljx1',
        email: 'user@mail.com',
        handle: 'user',
        createdAt: '2021-02-20T12:05:06.387Z',
        imageUrl: 'image/sdafdsaf/adsafsd,',
        bio: 'I am user of social network',
        website: 'user.com',
        location: 'Monte, UA'
    },
    likes: [
        {
            userHandle: 'user',
            scream: '3yd0EO8jVaWAGnmFqsbI',
        },
        {
            userHandle: 'user',
            scream: 'gdf834kfDaGhGnmFvSb4',
        }
    ]

}
