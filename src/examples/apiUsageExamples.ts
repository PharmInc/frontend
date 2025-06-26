/**
 * API Usage Examples
 * 
 * This file demonstrates how to use all the API wrapper functions
 * in a real React application.
 */
import {
  authService,
  userService,
  postService,
  //tagService,
  //commentService,
  institutionService,
  userEducationService,
  userExperienceService,
  //postTagService,
  //userTagService,
  ApiError
} from '../services';

/**
 * Authentication Examples
 */
export const authExamples = {
  // User login
  login: async () => {
    try {
      const response = await authService.login({
        email: 'user@example.com',
        password: 'password123'
      });
      console.log('Login successful:', response);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Login failed:', apiError.message);
      throw error;
    }
  },

  // User registration
  register: async () => {
    try {
      await authService.register({
        email: 'newuser@example.com',
        password: 'securepassword123'
      });
      console.log('Registration successful');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Registration failed:', apiError.message);
      throw error;
    }
  },

  // Logout
  logout: () => {
    authService.logout();
    console.log('User logged out');
  }
};

/**
 * User Management Examples
 */
export const userExamples = {
  // Create user profile
  createUser: async () => {
    try {
      const user = await userService.createUser({
        firstName: 'John',
        lastName: 'Doe',
        specialization: 'Cardiology'
      });
      console.log('User created:', user);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('User creation failed:', apiError.message);
      throw error;
    }
  },

  // Get user by ID
  getUser: async (userId: string) => {
    try {
      const user = await userService.getUserById(userId);
      console.log('User found:', user);
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('User not found:', apiError.message);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId: string) => {
    try {
      const updatedUser = await userService.updateUserRequest(userId, {
        firstName: 'Jane',
        specialization: 'Neurology'
      });
      console.log('User updated:', updatedUser);
      return updatedUser;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('User update failed:', apiError.message);
      throw error;
    }
  }
};

/**
 * Post Management Examples
 */
// export const postExamples = {
//   // Create post
//   createPost: async (userId: string) => {
//     try {
//       const post = await postService.createPost({
//         content: 'This is my first post about medical research!',
//         userId: userId
//       });
//       console.log('Post created:', post);
//       return post;
//     } catch (error) {
//       const apiError = error as ApiError;
//       console.error('Post creation failed:', apiError.message);
//       throw error;
//     }
//   },
//
//   // Get and update post
//   updatePost: async (postId: string) => {
//     try {
//       const post = await postService.getPostById(postId);
//       console.log('Original post:', post);
//
//       const updatedPost = await postService.updatePost(postId, {
//         content: 'Updated post content with new insights!'
//       });
//       console.log('Updated post:', updatedPost);
//       return updatedPost;
//     } catch (error) {
//       const apiError = error as ApiError;
//       console.error('Post update failed:', apiError.message);
//       throw error;
//     }
//   }
// };

/**
 * Comment Examples
 */
// export const commentExamples = {
//   // Create comment
//   createComment: async (postId: string, userId: string) => {
//     try {
//       const comment = await commentService.createComment({
//         content: 'Great insights! This research is very promising.',
//         postId: postId,
//         userId: userId
//       });
//       console.log('Comment created:', comment);
//       return comment;
//     } catch (error) {
//       const apiError = error as ApiError;
//       console.error('Comment creation failed:', apiError.message);
//       throw error;
//     }
//   },
//
//   // Create nested comment (reply)
//   createReply: async (postId: string, parentCommentId: string, userId: string) => {
//     try {
//       const reply = await commentService.createComment({
//         content: 'I agree with your analysis!',
//         postId: postId,
//         parentId: parentCommentId,
//         userId: userId
//       });
//       console.log('Reply created:', reply);
//       return reply;
//     } catch (error) {
//       const apiError = error as ApiError;
//       console.error('Reply creation failed:', apiError.message);
//       throw error;
//     }
//   }
// };

/**
 * Institution and Education Examples
 */
export const institutionExamples = {
  // Create institution
  createInstitution: async () => {
    try {
      const institution = await institutionService.createInstitution({
        name: 'Harvard Medical School',
        type: 'institution',
        location: 'Boston, MA, USA'
      });
      console.log('Institution created:', institution);
      return institution;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Institution creation failed:', apiError.message);
      throw error;
    }
  },

  // Add user education
  addEducation: async (institutionId: string) => {
    try {
      const education = await userEducationService.createUserEducation({
        title: 'Doctor of Medicine (MD)',
        description: 'Comprehensive medical education with focus on internal medicine',
        startDate: '2020-09-01',
        endDate: '2024-05-31',
        institutionId: institutionId
      });
      console.log('Education added:', education);
      return education;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Education creation failed:', apiError.message);
      throw error;
    }
  },

  // Add user experience
  addExperience: async (institutionId: string) => {
    try {
      const experience = await userExperienceService.createUserExperience({
        title: 'Resident Physician - Internal Medicine',
        description: 'Three-year residency program in internal medicine',
        startDate: '2024-06-01',
        endDate: '2027-05-31',
        institutionId: institutionId
      });
      console.log('Experience added:', experience);
      return experience;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Experience creation failed:', apiError.message);
      throw error;
    }
  }
};

/**
 * Tag and Relationship Examples
 */
// export const tagExamples = {
//   // Create tags and link them to posts and users
//   createAndLinkTags: async (postId: string, userId: string) => {
//     try {
//       // Create tags
//       const researchTag = await tagService.createTag({ tag: 'medical-research' });
//       const cardiologyTag = await tagService.createTag({ tag: 'cardiology' });
//       
//       console.log('Tags created:', { researchTag, cardiologyTag });
//
//       // Link tags to post
//       const postTag1 = await postTagService.createPostTag({
//         postId: postId,
//         tagId: researchTag.id
//       });
//
//       const postTag2 = await postTagService.createPostTag({
//         postId: postId,
//         tagId: cardiologyTag.id
//       });
//
//       // Link tags to user
//       const userTag1 = await userTagService.createUserTag({
//         userId: userId,
//         tagId: cardiologyTag.id
//       });
//
//       console.log('Tags linked:', { postTag1, postTag2, userTag1 });
//       
//       return { researchTag, cardiologyTag, postTag1, postTag2, userTag1 };
//     } catch (error) {
//       const apiError = error as ApiError;
//       console.error('Tag creation/linking failed:', apiError.message);
//       throw error;
//     }
//   }
// };

/**
 * Complete workflow example
 */
// export const completeWorkflowExample = async () => {
//   try {
//     console.log('Starting complete API workflow example...');
//
//     // 1. Register and login
//     await authService.register({
//       email: 'workflow@example.com',
//       password: 'workflowpassword123'
//     });
//
//     const loginResponse = await authService.login({
//       email: 'workflow@example.com',
//       password: 'workflowpassword123'
//     });
//
//     // 2. Create user profile
//     const user = await userService.createUser({
//       firstName: 'Dr. Sarah',
//       lastName: 'Johnson',
//       specialization: 'Cardiology'
//     });
//
//     // 3. Create institution
//     const institution = await institutionService.createInstitution({
//       name: 'Mayo Clinic',
//       about: 'Leading healthcare organization',
//       location: 'Rochester, MN'
//     });
//
//     // 4. Add education and experience
//     const education = await userEducationService.createUserEducation({
//       title: 'MD in Cardiology',
//       description: 'Specialized medical degree in cardiovascular medicine',
//       startDate: '2018-09-01',
//       endDate: '2022-05-31',
//       institutionId: institution.id
//     });
//
//     const experience = await userExperienceService.createUserExperience({
//       title: 'Attending Cardiologist',
//       description: 'Practicing cardiologist specializing in interventional procedures',
//       startDate: '2022-06-01',
//       institutionId: institution.id
//     });
//
//     // 5. Create post
//     const post = await postService.createPost({
//       content: 'Excited to share my latest research on cardiovascular interventions!',
//       userId: user.id
//     });
//
//     // 6. Create and link tags
//     const { researchTag, cardiologyTag } = await tagExamples.createAndLinkTags(post.id, user.id);
//
//     // 7. Add comment
//     const comment = await commentService.createComment({
//       content: 'This research looks very promising!',
//       postId: post.id,
//       userId: user.id
//     });
//
//     console.log('Complete workflow successful!', {
//       user, institution, education, experience, post, comment
//     });
//
//     return {
//       user, institution, education, experience, post, comment, researchTag, cardiologyTag
//     };
//
//   } catch (error) {
//     const apiError = error as ApiError;
//     console.error('Workflow failed:', apiError.message);
//     throw error;
//   }
// };
