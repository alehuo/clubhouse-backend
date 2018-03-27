var permissions = [
    {
        name: "BAN_USER",
        value: 0x00000001
    },
    {
        name: "EDIT_USER_ROLE",
        value: 0x00000002
    },
    {
        name: "MAKE_USER_ADMIN",
        value: 0x00000004
    },
    {
        name: "ALLOW_USER_LOGIN",
        value: 0x00000008
    },
    {
        name: "ADD_KEY_TO_USER",
        value: 0x00000010
    },
    {
        name: "REMOVE_KEY_FROM_USER",
        value: 0x00000020
    },
    {
        name: "CHANGE_KEY_TYPE_OF_USER",
        value: 0x00000040
    },
    {
        name: "ALLOW_VIEW_KEYS",
        value: 0x00000080
    },
    {
        name: "ADD_USER_TO_UNION",
        value: 0x00000100
    },
    {
        name: "REMOVE_USER_FROM_UNION",
        value: 0x00000200
    },
    {
        name: "ADD_STUDENT_UNION",
        value: 0x00000400
    },
    {
        name: "REMOVE_STUDENT_UNION",
        value: 0x00000800
    },
    {
        name: "EDIT_STUDENT_UNION",
        value: 0x00001000
    },
    {
        name: "ALLOW_VIEW_STUDENT_UNIONS",
        value: 0x00002000
    },
    {
        name: "ADD_EVENT",
        value: 0x00004000
    },
    {
        name: "EDIT_EVENT",
        value: 0x00008000
    },
    {
        name: "REMOVE_EVENT",
        value: 0x00010000
    },
    {
        name: "ALLOW_VIEW_EVENTS",
        value: 0x00020000
    },
    {
        name: "EDIT_RULES",
        value: 0x00040000
    },
    {
        name: "ALLOW_VIEW_RULES",
        value: 0x00080000
    },
    {
        name: "ADD_POSTS",
        value: 0x00100000
    },
    {
        name: "EDIT_AND_REMOVE_OWN_POSTS",
        value: 0x00200000
    },
    {
        name: "REMOVE_POSTS",
        value: 0x00400000
    },
    {
        name: "ALLOW_VIEW_POSTS",
        value: 0x00800000
    },
    {
        name: "EDIT_OTHERS_POSTS",
        value: 0x01000000
    },
    {
        name: "SEND_MAILS",
        value: 0x02000000
    }
];
var calculatePermissions = function (perms) {
    return perms.reduce(function (prev, curr) { return prev | curr.value; }, perms[0].value);
};
var getPermissions = function (userPerms) {
    var allowed = [];
    permissions.map(function (k) {
        var permissionName = k.name;
        var permissionValue = k.value;
        if ((userPerms & permissionValue) === permissionValue) {
            allowed.push(permissionName);
        }
    });
    return allowed;
};
var hasPermissions = function (userPerms, requiredPermissions) {
    if (typeof userPerms === "number") {
        if (typeof requiredPermissions === "number") {
            return (requiredPermissions & userPerms) === requiredPermissions;
        }
        else {
            var requiredPerms = calculatePermissions(requiredPermissions);
            return (requiredPerms & userPerms) === requiredPerms;
        }
    }
    else {
        if (typeof requiredPermissions === "number") {
            return ((requiredPermissions & calculatePermissions(userPerms)) ===
                requiredPermissions);
        }
        else {
            var requiredPerms = calculatePermissions(requiredPermissions);
            return ((requiredPerms & calculatePermissions(userPerms)) === requiredPerms);
        }
    }
};
console.log(hasPermissions([
    {
        name: "SEND_MAILS",
        value: 0x02000000
    },
    {
        name: "REMOVE_POSTS",
        value: 0x00400000
    }
], [
    {
        name: "SEND_MAILS",
        value: 0x02000000
    },
    {
        name: "REMOVE_POSTS",
        value: 0x00400000
    },
    {
        name: "EDIT_POSTS",
        value: 0x00400000
    }
]));
