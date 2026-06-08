<template>
  <div class="dark min-h-screen bg-background text-foreground">
    <!-- Sticky header -->
    <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div class="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
        <NuxtLink to="/" class="shrink-0" @click="isSeasonModalOpen = false">
          <UiButton variant="ghost" size="icon" type="button" aria-label="Back to practices">
            <span class="material-icons text-lg">arrow_back</span>
          </UiButton>
        </NuxtLink>

        <div class="min-w-0 flex-1">
          <p v-if="practice" class="truncate text-sm font-medium">
            {{ practice.name }}
          </p>
          <p v-else-if="loadError" class="text-sm text-destructive">
            Practice not found
          </p>
          <p v-else class="text-sm text-muted-foreground">
            Loading practice…
          </p>
        </div>

        <div v-if="practice" class="flex shrink-0 items-center gap-1">
          <UiButton
            variant="ghost"
            size="icon"
            type="button"
            :aria-pressed="editorEnabled"
            aria-label="Toggle editor"
            @click="toggleEditor"
          >
            <span class="material-icons text-lg">{{ editorEnabled ? 'close' : 'edit' }}</span>
          </UiButton>
          <UiButton
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Save practice"
            @click="savePractice"
          >
            <span class="material-icons text-lg">save</span>
          </UiButton>
          <UiButton
            variant="ghost"
            size="icon"
            type="button"
            aria-label="More actions"
            @click="isActionsOpen = true"
          >
            <span class="material-icons text-lg">more_vert</span>
          </UiButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 pb-32 pt-6">
      <!-- Loading -->
      <div v-if="!practice && !loadError" class="space-y-4">
        <UiSkeleton class="h-10 w-3/4" />
        <UiSkeleton class="h-6 w-1/2" />
        <UiSkeleton class="h-40 w-full" />
        <UiSkeleton class="h-40 w-full" />
      </div>

      <!-- Error -->
      <UiCard v-else-if="loadError" class="border-destructive/50">
        <UiCardHeader>
          <UiCardTitle>Could not load practice</UiCardTitle>
          <UiCardDescription>
            This practice may have been removed or the link is invalid.
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <NuxtLink to="/">
            <UiButton variant="outline">
              Back to all practices
            </UiButton>
          </NuxtLink>
        </UiCardContent>
      </UiCard>

      <!-- Practice content -->
      <template v-else-if="practice">
        <UiCard class="mb-6">
          <UiCardHeader class="pb-4">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <table class="min-w-0 flex-1">
                <tbody>
                  <tr>
                    <EditableField
                      :template-num="1"
                      :value="practice.name"
                      @input="(v) => (practice.name = v)"
                    />
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex flex-wrap gap-2 pt-2">
              <UiBadge v-if="practice.totalYardage" variant="secondary">
                {{ practice.totalYardage }} yds
              </UiBadge>
              <UiBadge v-if="practice.primaryStroke" variant="outline">
                {{ practice.primaryStroke }}
              </UiBadge>
              <UiBadge v-if="practice.totalTime" variant="outline">
                {{ practice.totalTime }}
              </UiBadge>
              <UiBadge v-if="poolLabel" variant="outline">
                {{ poolLabel }}
              </UiBadge>
            </div>
            <UiCardDescription v-if="practice.review" class="pt-2">
              {{ practice.review }}
            </UiCardDescription>
          </UiCardHeader>
        </UiCard>

        <LogsNotificationModel />

        <div class="space-y-4">
          <UiCard
            v-for="(set, setIndex) in practice.sets"
            :key="setIndex"
          >
            <UiCardHeader class="pb-3">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0 flex-1 space-y-1">
                  <table>
                    <tbody>
                      <tr>
                        <EditableField
                          :value="set.name"
                          @input="(v) => (set.name = v)"
                        />
                      </tr>
                    </tbody>
                  </table>
                  <UiCardDescription>
                    {{ set.description || 'Set topic' }}
                  </UiCardDescription>
                </div>
                <div class="flex flex-wrap gap-2">
                  <UiBadge variant="secondary">
                    {{ set.numRounds }} {{ set.numRounds === 1 ? 'round' : 'rounds' }}
                  </UiBadge>
                  <UiBadge v-if="set.heartRate" variant="outline">
                    HR {{ set.heartRate }}
                  </UiBadge>
                </div>
              </div>
              <UiButton
                variant="ghost"
                size="sm"
                type="button"
                class="mt-2 h-8 px-2 text-muted-foreground"
                @click="toggleTableVisibility(setIndex)"
              >
                {{ tableVisibility[setIndex] ? 'Show exercises' : 'Hide exercises' }}
              </UiButton>
            </UiCardHeader>

            <UiCardContent v-if="!tableVisibility[setIndex]">
              <UiTable>
                <UiTableHeader>
                  <UiTableRow>
                    <UiTableHead>Stroke</UiTableHead>
                    <UiTableHead>Qty</UiTableHead>
                    <UiTableHead>Dist</UiTableHead>
                    <UiTableHead>Description</UiTableHead>
                    <UiTableHead>Equip</UiTableHead>
                    <UiTableHead>Int</UiTableHead>
                  </UiTableRow>
                </UiTableHeader>
                <UiTableBody>
                  <UiTableRow
                    v-for="(exercise, exerciseIndex) in set.exercises"
                    :key="exerciseIndex"
                  >
                    <EditableField
                      :value="exercise.stroke"
                      @input="(v) => updateExercise('stroke', v, setIndex, exerciseIndex)"
                    />
                    <EditableField
                      :value="exercise.quantity"
                      @input="(v) => updateExercise('quantity', v, setIndex, exerciseIndex)"
                    />
                    <EditableField
                      :value="exercise.distance"
                      @input="(v) => updateExercise('distance', v, setIndex, exerciseIndex)"
                    />
                    <EditableField
                      :value="exercise.description"
                      @input="(v) => updateExercise('description', v, setIndex, exerciseIndex)"
                    />
                    <EditableField
                      :value="exercise.equipment"
                      @input="(v) => updateExercise('equipment', v, setIndex, exerciseIndex)"
                    />
                    <EditableField
                      :value="exercise.interval"
                      @input="(v) => updateExercise('interval', v, setIndex, exerciseIndex)"
                    />
                  </UiTableRow>
                </UiTableBody>
              </UiTable>

              <div v-if="editorEnabled" class="mt-4 flex flex-wrap gap-2">
                <UiButton
                  variant="secondary"
                  size="sm"
                  type="button"
                  @click="addExercise(setIndex)"
                >
                  Add exercise
                </UiButton>
                <UiButton
                  variant="outline"
                  size="sm"
                  type="button"
                  @click="addSet(setIndex)"
                >
                  Add set below
                </UiButton>
              </div>
            </UiCardContent>
          </UiCard>
        </div>
      </template>
    </main>

    <!-- Desktop footer actions -->
    <footer
      v-if="practice"
      class="fixed inset-x-0 bottom-0 z-40 hidden border-t border-border bg-background/95 backdrop-blur sm:block"
    >
      <div class="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <NuxtLink to="/">
          <UiButton variant="outline" size="sm">
            Close
          </UiButton>
        </NuxtLink>
        <div class="flex flex-wrap gap-2">
          <UiButton variant="secondary" size="sm" @click="isSeasonModalOpen = true">
            Bookmark
          </UiButton>
          <UiButton variant="secondary" size="sm" @click="isSeasonModalOpen = true">
            Add to profile
          </UiButton>
          <UiButton size="sm" @click="isSeasonModalOpen = true">
            Add to season
          </UiButton>
        </div>
      </div>
    </footer>

    <!-- Mobile footer actions -->
    <footer
      v-if="practice"
      class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur sm:hidden"
    >
      <div class="flex items-center justify-around gap-1 px-2 py-2">
        <NuxtLink to="/" class="flex-1">
          <UiButton variant="outline" size="sm" class="w-full">
            Close
          </UiButton>
        </NuxtLink>
        <UiButton variant="secondary" size="sm" class="flex-1" @click="isSeasonModalOpen = true">
          Save
        </UiButton>
        <UiButton size="sm" class="flex-1" @click="isSeasonModalOpen = true">
          Season
        </UiButton>
      </div>
    </footer>

    <!-- Zoom / view options -->
    <UiCard
      v-if="practice"
      class="fixed bottom-20 right-4 z-30 w-auto shadow-lg sm:bottom-6"
    >
      <UiCardContent class="flex flex-col gap-1 p-2">
        <template v-if="isOptionsExpanded">
          <UiButton variant="ghost" size="sm" type="button" @click="zoomIn">
            Zoom in
          </UiButton>
          <UiButton variant="ghost" size="sm" type="button" @click="zoomOut">
            Zoom out
          </UiButton>
          <UiButton variant="ghost" size="sm" type="button" @click="closeZoom">
            Reset zoom
          </UiButton>
          <UiSeparator />
        </template>
        <UiButton variant="outline" size="sm" type="button" @click="toggleOptions">
          {{ isOptionsExpanded ? 'Hide options' : 'Options' }}
        </UiButton>
      </UiCardContent>
    </UiCard>

    <!-- Actions dialog (mobile menu replacement) -->
    <UiDialog
      :open="isActionsOpen"
      title-id="practice-actions-title"
      content-class="max-w-sm"
      @update:open="(v) => { if (!v) isActionsOpen = false }"
      @close="isActionsOpen = false"
    >
      <div class="space-y-4 pr-6">
        <h2 id="practice-actions-title" class="text-lg font-semibold">
          Practice actions
        </h2>
        <div class="flex flex-col gap-2">
          <UiButton variant="secondary" class="w-full justify-start" @click="openSeasonFromActions">
            Add to profile
          </UiButton>
          <UiButton class="w-full justify-start" @click="openSeasonFromActions">
            Add to season
          </UiButton>
          <UiSeparator />
          <UiButton variant="ghost" class="w-full justify-start" @click="isActionsOpen = false">
            Cancel
          </UiButton>
        </div>
      </div>
    </UiDialog>

    <!-- Season / bookmark dialog -->
    <UiDialog
      :open="isSeasonModalOpen"
      title-id="season-dialog-title"
      content-class="max-w-lg max-h-[85vh] overflow-y-auto"
      @update:open="(v) => { if (!v) closeModal() }"
      @close="closeModal"
    >
      <div class="pr-6">
        <h2 id="season-dialog-title" class="mb-4 text-lg font-semibold">
          Save to season
        </h2>
        <SeasonList
          v-if="practice"
          :owner="practice.userID"
          :practice-i-d="practice.id"
          @close="closeModal"
        />
      </div>
    </UiDialog>
  </div>
</template>

<script>
import EditableField from '@/components/EditableField/EditableField.vue'
import LogsNotificationModel from '@/components/LogsNotificationModel/index.vue'
import SeasonList from '@/components/SeasonList/index.vue'
import { mapGetters, mapActions } from 'vuex'
import { loadPracticeById } from '@/composables/usePracticePage'
import UiButton from '@/components/ui/Button.vue'
import UiBadge from '@/components/ui/Badge.vue'
import UiCard from '@/components/ui/Card.vue'
import UiCardHeader from '@/components/ui/CardHeader.vue'
import UiCardTitle from '@/components/ui/CardTitle.vue'
import UiCardDescription from '@/components/ui/CardDescription.vue'
import UiCardContent from '@/components/ui/CardContent.vue'
import UiDialog from '@/components/ui/Dialog.vue'
import UiSeparator from '@/components/ui/Separator.vue'
import UiSkeleton from '@/components/ui/Skeleton.vue'
import UiTable from '@/components/ui/Table.vue'
import UiTableHeader from '@/components/ui/TableHeader.vue'
import UiTableBody from '@/components/ui/TableBody.vue'
import UiTableRow from '@/components/ui/TableRow.vue'
import UiTableHead from '@/components/ui/TableHead.vue'

const POOL_LABELS = {
  1: '25 yd pool',
  2: '25 m pool',
  3: '50 m pool'
}

export default {
  components: {
    EditableField,
    SeasonList,
    LogsNotificationModel,
    UiButton,
    UiBadge,
    UiCard,
    UiCardHeader,
    UiCardTitle,
    UiCardDescription,
    UiCardContent,
    UiDialog,
    UiSeparator,
    UiSkeleton,
    UiTable,
    UiTableHeader,
    UiTableBody,
    UiTableRow,
    UiTableHead
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      isLoading: 'getLoading'
    }),
    poolLabel () {
      if (!this.practice?.measurement) return null
      return POOL_LABELS[this.practice.measurement] || null
    }
  },

  data () {
    return {
      practice: null,
      loadError: false,
      tableVisibility: {},
      isEditing: false,
      localValue: this.value,
      zoom: 1,
      isOptionsExpanded: false,
      isSeasonModalOpen: false,
      isActionsOpen: false,
      editorEnabled: false
    }
  },

  async mounted () {
    const { $fire } = useNuxtApp()
    try {
      const id = this.$route.params.id
      this.practice = await loadPracticeById($fire, id)
      const jsonLd = {
        '@context': 'http://schema.org',
        '@type': 'SportsEvent',
        name: this.practice.name,
        description: this.practice.review
      }
      useHead({
        title: this.practice.name,
        meta: [
          {
            name: 'description',
            content: `This is a swim practice with a total yardage of ${this.practice.totalYardage} and the title is ${this.practice.name}`
          }
        ],
        link: [
          {
            rel: 'canonical',
            href: `https://www.swimpractices.com/${this.practice.id}`
          }
        ],
        script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }]
      })
    } catch (error) {
      console.error('Error fetching practice:', error)
      this.loadError = true
    }
  },

  watch: {
    isSeasonModalOpen (open) {
      if (open) {
        this.isActionsOpen = false
      }
    }
  },

  methods: {
    ...mapActions('practices', ['addExerciseToSet']),
    ...mapActions(['addPracticeToSeason', 'createSeason']),

    openSeasonFromActions () {
      this.isActionsOpen = false
      this.isSeasonModalOpen = true
    },

    closeModal () {
      this.isSeasonModalOpen = false
    },

    async fetchPractice () {
      await this.$store.dispatch('practices/fetchPracticeByID', this.$route.params.id)
      this.practice = this.$store.state.practices.practice
    },

    toggleEditor () {
      this.editorEnabled = !this.editorEnabled
    },

    generateRandomKey () {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    },

    async addToSeason (seasonID) {
      const practiceID = this.$route.params.id
      await this.addPracticeToSeason({ seasonID, practiceID })
    },

    async createNewSeason (seasonData) {
      const seasonID = this.generateRandomKey()
      await this.createSeason({ seasonID, seasonData })
    },

    addSet (setIndex) {
      const newSet = {
        favorites: 0,
        heartRate: '120-150',
        numRounds: 1,
        exercises: [{
          id: '19239181jro0',
          stroke: 'Enter stroke',
          quantity: 1,
          distance: 1,
          description: 'Enter description',
          equipment: 1,
          interval: 1
        }],
        name: 'New Set',
        description: 'New Set Description'
      }

      this.$store.dispatch('practices/addOrUpdateSet', {
        practiceID: this.$route.params.id,
        setIndex,
        set: newSet
      })
    },

    async addExercise (setIndex) {
      const newExercise = {
        id: 'akf914141',
        stroke: 'Enter stroke',
        quantity: 1,
        distance: 1,
        description: 'Enter description',
        equipment: 1,
        interval: 1
      }

      await this.$store.dispatch('practices/addOrUpdateExerciseToSet', {
        practiceID: this.$route.params.id,
        setIndex,
        exercise: newExercise
      }).then(() => this.fetchPractice())
    },

    updateExercise (property, newValue, setIndex, exerciseIndex) {
      this.$store.dispatch('practices/addOrUpdateExerciseToSet', {
        practiceID: this.$route.params.id,
        setIndex,
        exerciseIndex,
        property,
        newValue
      })
    },

    toggleTableVisibility (setIndex) {
      this.tableVisibility[setIndex] = !this.tableVisibility[setIndex]
    },

    async savePractice () {
      if (!this.user) {
        await this.$store.dispatch('notifications/addNotification', {
          message: 'Guests cannot save practices. Please log in.',
          type: 3
        })
        return
      }
      const practiceID = this.$route.params.id
      const practice = this.$store.state.practices.practices.find((p) => p.id === practiceID)

      if (practice && practice.userID === this.user.id) {
        try {
          await this.$fire.firestore.collection('practices').doc(practiceID).update(this.practice)
          await this.$store.dispatch('notifications/addNotification', {
            message: 'Practice saved successfully',
            type: 2
          })
        } catch {
          await this.$store.dispatch('notifications/addNotification', {
            message: 'Error updating practice',
            type: 1
          })
        }
      } else {
        const practiceData = { ...this.practice, userID: this.user.id }
        try {
          const newPracticeRef = await this.$fire.firestore.collection('practices').add(practiceData)
          await this.$store.dispatch('notifications/addNotification', {
            message: 'Saved as your copy',
            type: 2
          })
          this.$router.push(`/${newPracticeRef.id}`)
        } catch (error) {
          console.error('Error saving new practice:', error)
        }
      }
    },

    zoomIn () {
      this.zoom += 0.1
      document.body.style.transform = `scale(${this.zoom})`
    },

    zoomOut () {
      if (this.zoom > 0.1) {
        this.zoom -= 0.1
        document.body.style.transform = `scale(${this.zoom})`
      }
    },

    closeZoom () {
      this.zoom = 1
      document.body.style.transform = 'scale(1)'
    },

    toggleOptions () {
      this.isOptionsExpanded = !this.isOptionsExpanded
    }
  },

  beforeUnmount () {
    this.closeZoom()
  }
}
</script>
