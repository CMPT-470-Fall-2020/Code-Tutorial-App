let mock_DB = {
  user: {
    bChan: {
      password: "1234",
      accountType: "instructor",
      courses: ["CMPT470"],
    },
    jBond: {
      password: "5678",
      accountType: "student",
      courses: ["CMPT470", "CMPT318"],
    },
  },
  autograder: {
    test_1: {
      courseID: "CMPT470",
      username: "bChan",
      code: "print('hello world')",
      testName: "Example Test",
    },
  },
  courses: {
    CMPT470: {
      courseName: "CMPT470 - Web development",
      term: "fall",
    },
    CMPT318: {
      courseName: "CMPT318 - Cybersecurity",
      term: "fall",
    },
  },
  tutorial: {
    tutorial_1: {
      title: "Tutorial 1 for cmpt 470",
      username: "bChan",
      courseID: "CMPT470",
      text: "# Hello world",
    },
    tutorial_2: {
      title: "Tutorial 2 for cmpt 470",
      username: "bChan",
      courseID: "CMPT470",
      text: "# Lets learn some more stuff",
    },
    tutorial_2: {
      title: "Tutorial 1 for cmpt 318",
      username: "uGlasser",
      courseID: "CMPT318",
      text: "# Lets learn some more stuff",
    },
  },
  comments: {
    comment_1: {
      username: "bChan",
      date: "10-10-2020",
      text: "Try this...!",
      postID: "post_1",
    },
    comment_2: {
      username: "bChan",
      date: "11-10-2020",
      text: "Actually, on second thought, you can try this as well!",
      postID: "post_1",
    },
  },
  posts: {
    post_1: {
      courseID: "CMPT470",
      username: "jBond",
      date: "10-10-2020",
      title: "Please help me.",
      text: "I have a problem.",
    },
  },
};

// TODO: remove this mock database once the main database is done
let mock_DB_extended = {
  forum: {
    sub_forum_id_1: {
      t1: {
        title: "Thread 1",
        summary: "Here is a summary that is less than 120 chars!",
        numPosts: 4,
        postId: "ABC",
      },
      t2: {
        title: "Thread 2",
        summary: "Here is a summary that is less than 120 chars!",
        numPosts: 16,
        postId: "DEF",
      },
    },
    posts: {
      ABC: [
        {
          id: 1,
          post_text: "Here is my question",
          likes: 2,
          author: "Some guy",
        },
        {
          id: 2,
          post_text: "Here is an answer",
          likes: 4,
          author: "Some guy",
        },
        {
          id: 3,
          post_text: "Here is some more information to help",
          likes: 55,
          author: "Some other guy",
        },
      ],
      DEF: [
        {
          id: 4,
          post_text: "Here is my question",
          likes: 2,
          author: "Some other guy",
        },
        {
          id: 5,
          post_text: "Here is an answer",
          likes: 4,
          author: "Some other guy",
        },
        {
          id: 5,
          post_text: "Here is some more information to help",
          likes: 55,
          author: "Some other guy",
        },
      ],
    },
  },
  classes: {
    class1: {
      class_id: "CMPT 470",
      prof: "Bobby Chan",
      class_name: "Web Dev",
      class_desc: "Web Development is taught here",
      num_students: 55,
      forum: "sub_forum_id_1",
      tutorial_list_id: "tutorial_set_id_1",
    },
    class2: {
      class_id: "CMPT 353",
      prof: "Greg Baker",
      class_name: "Data Science",
      class_desc: "Learn about ML and basic Stats",
      num_students: 420,
      forum: "NONE",
      tutorial_list_id: "tutorial_set_id_2",
    },
    class3: {
      class_id: "CMPT 318",
      prof: "Uwe Glasser",
      class_name: "Computer Security",
      class_desc: "SQL injections and shit",
      num_students: 69,
      forum: "NONE",
      tutorial_list_id: "NONE",
    },
  },
  tutorial_set: {
    tutorial_set_id_1: [
      {
        title: "Title 1",
        summary: "Short summary",
        hidden: false,
        tutorial_id: "t1",
      },
      {
        title: "Title 2",
        summary: "Short summary 2",
        hidden: true,
        tutorial_id: "t2",
      },
    ],
    tutorial_set_id_2: [
      {
        title: "Title 1",
        summary: "Short summary",
        hidden: false,
        tutorial_id: "t3",
      },
      {
        title: "Title 2",
        summary: "Short summary 2",
        hidden: true,
        tutorial_id: "t4",
      },
    ],
  },
  tutorials: {
    t1: {
      title: "Title 1",
      summary: "Short summary 1",
      hidden: true,
      mardown:
        "RAW MARKDOWN OF THE ARTICLE HERE. THIS IS USED IF THE ARTICLE NEEDS TO BE EDITED",
      html: "CONVERTED HTML OF ARTICLE HERE",
    },
    t2: {
      title: "Title 2",
      summary: "Short summary 2",
      hidden: true,
      mardown:
        "RAW MARKDOWN OF THE ARTICLE HERE. THIS IS USED IF THE ARTICLE NEEDS TO BE EDITED",
      html: "CONVERTED HTML OF ARTICLE HERE",
    },
    t3: {
      title: "Title 1",
      summary: "Short summary 1",
      hidden: true,
      mardown:
        "RAW MARKDOWN OF THE ARTICLE HERE. THIS IS USED IF THE ARTICLE NEEDS TO BE EDITED",
      html: "CONVERTED HTML OF ARTICLE HERE",
    },
    t4: {
      title: "Title 2",
      summary: "Short summary 2",
      hidden: true,
      mardown:
        "RAW MARKDOWN OF THE ARTICLE HERE. THIS IS USED IF THE ARTICLE NEEDS TO BE EDITED",
      html: "CONVERTED HTML OF ARTICLE HERE",
    },
  },
  users: {
    user_id_1: {
      password: "ABC",
      type: "student",
      fname: "Yavor",
      lname: "Konstantinov",
      classes: ["class1", "class3"],
    },
    user_id_2: {
      password: "DEF",
      type: "instructor",
      fname: "Bobby",
      lname: "Chan",
      classes: ["class1"],
    },
  },
};

module.exports.mock_DB = mock_DB;
