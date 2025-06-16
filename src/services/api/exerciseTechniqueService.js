import { toast } from 'sonner';

class ExerciseTechniqueService {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'exercise_key', 'category', 'description', 'proper_form', 'common_mistakes', 'demo_url']
      };

      const response = await apperClient.fetchRecords('exercise_technique', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching exercise techniques:", error);
      toast.error("Failed to load exercise techniques");
      return [];
    }
  }

  async getById(exerciseKey) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'exercise_key', 'category', 'description', 'proper_form', 'common_mistakes', 'demo_url'],
        where: [
          {
            FieldName: "exercise_key",
            Operator: "ExactMatch",
            Values: [exerciseKey]
          }
        ]
      };

      const response = await apperClient.fetchRecords('exercise_technique', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const techniques = response.data || [];
      if (techniques.length === 0) {
        throw new Error(`Exercise technique not found: ${exerciseKey}`);
      }

      return techniques[0];
    } catch (error) {
      console.error(`Error fetching exercise technique ${exerciseKey}:`, error);
      toast.error("Failed to load exercise technique");
      return null;
    }
  }

  async getTechniquesByCategory(category) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'exercise_key', 'category', 'description', 'proper_form', 'common_mistakes', 'demo_url'],
        where: [
          {
            FieldName: "category",
            Operator: "ExactMatch",
            Values: [category]
          }
        ]
      };

      const response = await apperClient.fetchRecords('exercise_technique', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching techniques by category ${category}:`, error);
      toast.error("Failed to load techniques by category");
      return [];
    }
  }

  async searchTechniques(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'exercise_key', 'category', 'description', 'proper_form', 'common_mistakes', 'demo_url'],
        whereGroups: [
          {
            operator: "OR",
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: "Name",
                    Operator: "Contains",
                    Values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "description",
                    Operator: "Contains", 
                    Values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "proper_form",
                    Operator: "Contains",
                    Values: [query]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('exercise_technique', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error searching techniques with query ${query}:`, error);
      toast.error("Failed to search exercise techniques");
      return [];
    }
  }

  async getRelatedExercises(exerciseKey) {
    try {
      // First get the current exercise to find its category
      const currentExercise = await this.getById(exerciseKey);
      if (!currentExercise) return [];

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'exercise_key', 'category', 'description', 'proper_form', 'common_mistakes', 'demo_url'],
        whereGroups: [
          {
            operator: "AND",
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: "category",
                    Operator: "ExactMatch",
                    Values: [currentExercise.category]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "exercise_key",
                    Operator: "NotEqualTo",
                    Values: [exerciseKey]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('exercise_technique', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching related exercises for ${exerciseKey}:`, error);
      toast.error("Failed to load related exercises");
      return [];
    }
  }
}

export default new ExerciseTechniqueService();