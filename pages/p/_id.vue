<template>
  <div class="p-2 md:p-4 bg-gray-900 min-h-screen">
    <div v-if="!practice">Loading...</div>
    <div v-else class="max-w-screen-sm mx-auto bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
      <div class="px-2 md:px-6 py-2 md:py-4">
        <h1>{{ practice.name }}</h1>
        <div v-for="(set, setIndex) in practice.sets" :key="setIndex" class="mb-4">
          <div>
            <h2>{{ set.name }}</h2>
            <p>Set Topic: {{ set.description }}</p>
            <p>{{ set.numRounds }} round(s)</p>
            <p>HR: {{ set.heartRate }}</p>
          </div>
          <div class="overflow-x-auto">
            <table class="table-auto w-full mt-2 text-gray-300 text-xs md:text-sm">
              <thead>
                <tr class="bg-gray-700">
                  <th>Stroke</th>
                  <th>Quantity</th>
                  <th>Distance</th>
                  <th>Description</th>
                  <th>Equipment</th>
                  <th>Interval</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(exercise, exerciseIndex) in set.exercises" :key="exerciseIndex">
                  <td>{{ exercise.stroke }}</td>
                  <td>{{ exercise.quantity }}</td>
                  <td>{{ exercise.distance }}</td>
                  <td>{{ exercise.description }}</td>
                  <td>{{ exercise.equipment }}</td>
                  <td>{{ exercise.interval }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  async asyncData({ params, app }) {
    const db = app.$fire.firestore;
    try {
      const doc = await db.collection('practices').doc(params.id).get();
      if (!doc.exists) {
        throw new Error("This practice was not found!");
      }
      return { practice: doc.data() };
    } catch (error) {
      console.error('Error fetching practices: ', error);
      throw error;
    }
  },

  head() {
    return {
      title: this.practice ? this.practice.name : 'Loading...',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.practice ? `This is a swim practice with a total yardage of ${this.practice.totalYardage} and the title is ${this.practice.name}` : 'Loading practice...'
        }
      ]
    }
  }
};
</script>
