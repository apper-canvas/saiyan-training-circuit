import { toast } from 'sonner';

const achievementService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'description', 'type', 'requirement', 'badge', 'color', 'unlocked', 'unlocked_at']
      };

      const response = await apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: ['Name', 'description', 'type', 'requirement', 'badge', 'color', 'unlocked', 'unlocked_at']
      };

      const response = await apperClient.getRecordById('achievement', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching achievement with ID ${id}:`, error);
      toast.error("Failed to load achievement");
      return null;
    }
  },

  async create(achievement) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          description: achievement.description,
          type: achievement.type,
          requirement: parseInt(achievement.requirement),
          badge: achievement.badge,
          color: achievement.color,
          unlocked: achievement.unlocked || false,
          unlocked_at: achievement.unlocked_at || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating achievement:", error);
      toast.error("Failed to create achievement");
      return null;
    }
  },

  async update(id, achievementData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          description: achievementData.description,
          type: achievementData.type,
          requirement: parseInt(achievementData.requirement),
          badge: achievementData.badge,
          color: achievementData.color,
          unlocked: achievementData.unlocked,
          unlocked_at: achievementData.unlocked_at || achievementData.unlockedAt
        }]
      };

      const response = await apperClient.updateRecord('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast.error("Failed to update achievement");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Failed to delete achievement");
      return false;
    }
  },

  async checkStreakMilestones(currentStreak, completedWorkouts) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'description', 'type', 'requirement', 'badge', 'color', 'unlocked', 'unlocked_at'],
        whereGroups: [
          {
            operator: "AND",
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: "type",
                    Operator: "ExactMatch",
                    Values: ["streak"]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "requirement", 
                    Operator: "LessThanOrEqualTo",
                    Values: [currentStreak.toString()]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "unlocked",
                    Operator: "ExactMatch",
                    Values: ["false"]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const milestones = response.data || [];
      const newlyUnlocked = [];

      for (const milestone of milestones) {
        const updateParams = {
          records: [{
            Id: milestone.Id,
            unlocked: true,
            unlocked_at: new Date().toISOString()
          }]
        };

        const updateResponse = await apperClient.updateRecord('achievement', updateParams);
        if (updateResponse.success && updateResponse.results?.[0]?.success) {
          newlyUnlocked.push({
            ...milestone,
            unlocked: true,
            unlocked_at: new Date().toISOString()
          });
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error("Error checking streak milestones:", error);
      return [];
    }
  },

  async checkCompletionMilestones(totalCompletedWorkouts) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'description', 'type', 'requirement', 'badge', 'color', 'unlocked', 'unlocked_at'],
        whereGroups: [
          {
            operator: "AND",
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: "type",
                    Operator: "ExactMatch",
                    Values: ["completion"]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "requirement",
                    Operator: "LessThanOrEqualTo", 
                    Values: [totalCompletedWorkouts.toString()]
                  }
                ]
              },
              {
                conditions: [
                  {
                    FieldName: "unlocked",
                    Operator: "ExactMatch",
                    Values: ["false"]
                  }
                ]
              }
            ]
          }
        ]
      };

      const response = await apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const milestones = response.data || [];
      const newlyUnlocked = [];

      for (const milestone of milestones) {
        const updateParams = {
          records: [{
            Id: milestone.Id,
            unlocked: true,
            unlocked_at: new Date().toISOString()
          }]
        };

        const updateResponse = await apperClient.updateRecord('achievement', updateParams);
        if (updateResponse.success && updateResponse.results?.[0]?.success) {
          newlyUnlocked.push({
            ...milestone,
            unlocked: true,
            unlocked_at: new Date().toISOString()
          });
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error("Error checking completion milestones:", error);
      return [];
    }
  },

  async getUnlockedAchievements() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Name', 'description', 'type', 'requirement', 'badge', 'color', 'unlocked', 'unlocked_at'],
        where: [
          {
            FieldName: "unlocked",
            Operator: "ExactMatch",
            Values: ["true"]
          }
        ]
      };

      const response = await apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching unlocked achievements:", error);
      toast.error("Failed to load unlocked achievements");
      return [];
    }
  }
};

export default achievementService;