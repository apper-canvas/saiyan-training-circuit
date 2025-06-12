import techniqueData from '@/services/mockData/exerciseTechnique.json';

class ExerciseTechniqueService {
  constructor() {
    this.data = [...techniqueData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.data];
  }

  async getById(exerciseKey) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const technique = this.data.find(item => item.exerciseKey === exerciseKey);
    if (!technique) {
      throw new Error(`Exercise technique not found: ${exerciseKey}`);
    }
    return { ...technique };
  }

  async getTechniquesByCategory(category) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.data.filter(item => item.category === category).map(item => ({ ...item }));
  }

  async searchTechniques(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchTerm = query.toLowerCase();
    return this.data
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.properForm.some(tip => tip.toLowerCase().includes(searchTerm)) ||
        item.commonMistakes.some(mistake => mistake.issue.toLowerCase().includes(searchTerm))
      )
      .map(item => ({ ...item }));
  }

  async getRelatedExercises(exerciseKey) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const currentExercise = this.data.find(item => item.exerciseKey === exerciseKey);
    if (!currentExercise) return [];
    
    return this.data
      .filter(item => 
        item.exerciseKey !== exerciseKey && 
        item.category === currentExercise.category
      )
      .map(item => ({ ...item }));
  }
}

export default new ExerciseTechniqueService();