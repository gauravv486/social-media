import User from "../models/User.js"


// getuser
export const getUserProfile = async (req, res) => {
    try {

        const user = await User.findOne({ username: req.params.username })
            .select("-password")
            .populate('followers', 'username fullName profilePicture')
            .populate('following', 'username fullName profilePicture')

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: "server error"
        })
    }
}


// follow
export const followUser = async (req, res) => {
    try {

        const currentUserId = req.user._id;

        const targetUser = await User.findOne({ username: req.params.userId });

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const targetUserId = targetUser._id;

        if (targetUserId.equals(currentUserId)) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        const currentUser = await User.findById(currentUserId);

        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: 'Already following this user' });
        }


        await User.findOneAndUpdate(currentUserId, {
            $push: { following: targetUserId }
        })

        await User.findByIdAndUpdate(targetUserId, {
            $push: { followers: currentUserId }
        });

        res.json({ message: 'User followed successfully' });


    } catch (error) {
        res.status(500).json({
            message: "Server error" + error
        });
    }
}

// unfollow 
export const unfollowUser = async (req, res) => {
    try {

        const currentUserId = req.user._id;

        const targetUser = await User.findOne({
            username: req.params.userId
        })

        const targetUserId = targetUser._id;

        // Can't unfollow yourself
        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({ message: "You can't unfollow yourself" });
        }

        const currentUser = await User.findById(currentUserId);

        // Check if actually following
        if (!currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        // Remove from following/followers
        await User.findByIdAndUpdate(currentUserId, {
            $pull: { following: targetUserId }
        });

        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId }
        });

        res.json({ message: 'User unfollowed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFollower = async (req, res) => {



        try {
        const user = await User.findOne({
            username : req.params.userId
        })
            .select('followers username')
            .populate('followers', 'username fullName profilePicture');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.followers);

    } catch (error) {
        res.status(500).json({ message: 'Server error ' + error });
    }

 
}

export const getFollowing = async (req, res) => {
    try {
        const user = await User.findOne({
            username : req.params.userId
        })
            .select('following username')
            .populate('following', 'username fullName profilePicture');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.following);

    } catch (error) {
        res.status(500).json({ message: 'Server error ' + error });
    }
};


export const updateUserProfile = async (req, res) => {
    try {

        const { fullName, profilePicture, bio } = req.body;
        const currentUserId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(currentUserId, {
            $set: {
                fullName,
                bio,
                profilePicture
            }
        },
            {
                new: true, runValidators: true
            }
        ).select('-password')

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}