const APP_VERSION = '0.3.3-cloud-sections';
const DB_NAME = 'diet-planner-local-db';
const DB_VERSION = 3;
const STORES = ['settings', 'macroTargets', 'foods', 'baseline', 'plans', 'body', 'blood', 'profiles', 'nutritionLookupCache', 'dashboardPreferences', 'recipes', 'recipeAlternatives', 'nutritionProviders'];
const SESSION_KEY = 'dietPlanner.activeSession';
const CLOUD_SESSION_KEY = 'dietPlanner.cloudSession';
const API_BASE = '';
const API_TIMEOUT_MS = 8000;

const DESKTOP_NAV = [
  ['today', '◉', 'nav.dashboard'],
  ['week', '▦', 'nav.week'],
  ['grocery', '☑', 'nav.grocery'],
  ['prep', '◫', 'nav.prep'],
  ['body', '⌁', 'nav.body'],
  ['blood', '✚', 'nav.blood'],
  ['progress', '↗', 'nav.analysis'],
  ['recipes', '▤', 'nav.recipes'],
  ['settings', '⚙', 'nav.settings'],
];

const MOBILE_NAV = [
  ['today', '◉', 'nav.today'],
  ['week', '▦', 'nav.weekShort'],
  ['grocery', '☑', 'nav.groceryShort'],
  ['recipes', '▤', 'nav.recipesShort'],
  ['progress', '↗', 'nav.progress'],
  ['settings', '⚙', 'nav.settings'],
];

const MEAL_SLOTS = [
  { slot: 'Breakfast', time: '07:30' },
  { slot: 'Snack 1', time: '10:30' },
  { slot: 'Lunch', time: '13:00' },
  { slot: 'Snack 2', time: '16:30' },
  { slot: 'Dinner', time: '20:00' },
];

const DEPARTMENTS = [
  'Fruit & vegetables',
  'Meat & fish',
  'Dairy & eggs',
  'Bakery',
  'Pasta, rice & grains',
  'Canned goods',
  'Frozen',
  'Pantry & condiments',
  'Snacks',
  'Supplements / protein products',
  'Other',
];

const SAMPLE_BASELINE = `Breakfast:
- Greek yogurt 250g
- Oats 40g
- Banana 1

Snack:
- Skyr 170g
- Apple 1

Lunch:
- Chicken breast 180g
- Rice 80g
- Vegetables 250g
- Olive oil 10g

Snack:
- Rice cakes 4
- Bresaola 60g

Dinner:
- Salmon 150g
- Potatoes 300g
- Vegetables 250g`;

const DEFAULT_TARGET = {
  id: 'default',
  calories: 2600,
  protein: 190,
  carbs: 285,
  fat: 75,
  notes: 'Starter target. Replace with your nutritionist target.',
  tolerance: { caloriesPct: 5, protein: 5, carbs: 10, fat: 5 },
  workout: { enabled: false, calories: 2750, protein: 190, carbs: 320, fat: 75 },
  rest: { enabled: false, calories: 2450, protein: 190, carbs: 245, fat: 80 },
  updatedAt: new Date().toISOString(),
};


const I18N = {
  en: {
    'app.privateMvp': 'Diet Planner Cloud ready',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.completed': 'Completed',
    'common.skipped': 'Skipped',
    'common.planned': 'Planned',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.source': 'Source',
    'common.confidence': 'Confidence',
    'nav.dashboard': 'Dashboard',
    'nav.today': 'Today',
    'nav.week': 'Weekly Plan',
    'nav.weekShort': 'Week',
    'nav.grocery': 'Grocery List',
    'nav.groceryShort': 'Grocery',
    'nav.prep': 'Meal Prep',
    'nav.body': 'Body Data',
    'nav.blood': 'Blood Exams',
    'nav.analysis': 'Analysis',
    'nav.progress': 'Progress',
    'nav.recipes': 'Recipes',
    'nav.recipesShort': 'Recipes',
    'nav.settings': 'Settings',
    'page.today': 'Today',
    'page.week': 'Weekly Plan',
    'page.grocery': 'Grocery List',
    'page.prep': 'Meal Prep',
    'page.progress': 'Progress Analysis',
    'page.recipes': 'Recipes',
    'page.body': 'Body Data',
    'page.blood': 'Blood Exams',
    'page.settings': 'Settings',
    'meal.breakfast': 'Breakfast',
    'meal.snack1': 'Snack 1',
    'meal.lunch': 'Lunch',
    'meal.snack2': 'Snack 2',
    'meal.dinner': 'Dinner',
    'macro.dailyTarget': 'Daily macro target',
    'macro.calories': 'Calories',
    'macro.protein': 'Protein',
    'macro.carbs': 'Carbs',
    'macro.fat': 'Fat',
    'macro.consumed': 'Consumed',
    'macro.projected': 'Projected',
    'macro.target': 'Target',
    'macro.difference': 'Difference',
    'macro.onTarget': 'On target',
    'macro.slightlyOff': 'Slightly off',
    'macro.needsData': 'Needs data',
    'progress.title': 'Progress',
    'progress.overall': 'Overall',
    'progress.completedMeals': '{completed} of {total} meals completed',
    'progress.explainer': 'Overall progress uses completed meals divided by planned meals. Macro bars are shown separately.',
    'dashboard.mealChecklist': 'Meal checklist',
    'dashboard.workoutSummary': 'Workout adjustment',
    'dashboard.mealPrepSummary': 'Meal prep summary',
    'dashboard.grocerySummary': 'Grocery summary',
    'dashboard.detailsHint': 'Tap to open details',
    'dashboard.restDay': 'Rest/normal day',
    'dashboard.workoutDay': 'Workout day',
    'dashboard.noPlan': 'No plan for today',
    'dashboard.generateWeek': 'Generate this work week',
    'detail.foodAssumptions': 'Food-level assumptions',
    'detail.mealContribution': 'Meal-by-meal macro contribution',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'settings.themeSystem': 'System',
    'settings.localProfile': 'Local profile',
    'settings.localProfileNote': 'Local profile is offline/demo mode. Production accounts use Diet Planner Cloud login for sync.',
    'settings.usdaApiKey': 'Nutrition provider credentials',
    'settings.usdaApiKeyHelp': 'External provider credentials are configured only on the Diet Planner backend.',
    'profile.createTitle': 'Create local profile',
    'profile.displayName': 'Display name',
    'profile.email': 'Email, optional',
    'profile.pin': 'PIN/password, optional',
    'profile.continueWithoutPassword': 'Continue without password',
    'profile.create': 'Create profile',
    'profile.logout': 'Log out / switch profile',
    'profile.unlock': 'Unlock profile',
    'lookup.title': 'Nutrition lookup',
    'lookup.search': 'Search food',
    'lookup.provider': 'Provider',
    'lookup.auto': 'Auto: Diet Planner Cloud priority',
    'lookup.localOnly': 'Local offline database',
    'lookup.usda': 'USDA tramite Diet Planner Cloud',
    'lookup.off': 'Open Food Facts tramite Diet Planner Cloud',
    'lookup.searchButton': 'Search nutrition data',
    'lookup.import': 'Import and edit later',
    'lookup.noResults': 'No usable per-100g macro values found. Add the food manually.',
    'warning.seedValues': 'Values may vary by brand and raw/cooked state. Verify package labels when precision matters.',
    'auth.cloudTitle': 'Diet Planner Cloud account',
    'auth.cloudHelp': 'Production login. Users sign in to Diet Planner only; provider API keys stay on the backend.',
    'auth.cloudEmail': 'Account email',
    'auth.cloudPassword': 'Password',
    'auth.cloudLogin': 'Log in to Diet Planner Cloud',
    'auth.offlineDemo': 'Offline/demo local profile',
    'auth.cloudConnected': 'Cloud account connected',
    'auth.cloudUnavailable': 'Diet Planner Cloud is unavailable. You can continue with offline/demo mode.',
    'settings.nutrition.cloudStatus': 'Nutrition Sources status',
    'settings.nutrition.cloudManaged': 'Connected through Diet Planner Cloud',
    'settings.nutrition.noUserKeys': 'Normal users never enter USDA, Open Food Facts, or other external API keys.',
    'settings.nutrition.cacheNote': 'Normalized foods are cached by the backend and may also be cached in this browser for offline use.',
    'common.connected': 'Connected',
    'common.disconnected': 'Disconnected',
    'common.backendManaged': 'Backend-managed'
  },
  it: {
    'app.privateMvp': 'Pronto per Diet Planner Cloud',
    'common.close': 'Chiudi',
    'common.open': 'Apri',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.completed': 'Completato',
    'common.skipped': 'Saltato',
    'common.planned': 'Pianificato',
    'common.edit': 'Modifica',
    'common.delete': 'Elimina',
    'common.source': 'Fonte',
    'common.confidence': 'Affidabilità',
    'nav.dashboard': 'Dashboard',
    'nav.today': 'Oggi',
    'nav.week': 'Piano settimanale',
    'nav.weekShort': 'Settimana',
    'nav.grocery': 'Lista spesa',
    'nav.groceryShort': 'Spesa',
    'nav.prep': 'Meal prep',
    'nav.body': 'Dati corpo',
    'nav.blood': 'Esami sangue',
    'nav.analysis': 'Analisi',
    'nav.progress': 'Progressi',
    'nav.recipes': 'Ricette',
    'nav.recipesShort': 'Ricette',
    'nav.settings': 'Impostazioni',
    'page.today': 'Oggi',
    'page.week': 'Piano settimanale',
    'page.grocery': 'Lista spesa',
    'page.prep': 'Meal prep',
    'page.progress': 'Analisi progressi',
    'page.recipes': 'Ricette',
    'page.body': 'Dati corpo',
    'page.blood': 'Esami sangue',
    'page.settings': 'Impostazioni',
    'meal.breakfast': 'Colazione',
    'meal.snack1': 'Spuntino 1',
    'meal.lunch': 'Pranzo',
    'meal.snack2': 'Spuntino 2',
    'meal.dinner': 'Cena',
    'macro.dailyTarget': 'Obiettivo macro giornaliero',
    'macro.calories': 'Calorie',
    'macro.protein': 'Proteine',
    'macro.carbs': 'Carboidrati',
    'macro.fat': 'Grassi',
    'macro.consumed': 'Consumati',
    'macro.projected': 'Previsti',
    'macro.target': 'Obiettivo',
    'macro.difference': 'Differenza',
    'macro.onTarget': 'In target',
    'macro.slightlyOff': 'Leggermente fuori',
    'macro.needsData': 'Servono dati',
    'progress.title': 'Progressi',
    'progress.overall': 'Complessivo',
    'progress.completedMeals': '{completed} di {total} pasti completati',
    'progress.explainer': 'Il progresso complessivo usa i pasti completati divisi per i pasti pianificati. Le barre macro sono separate.',
    'dashboard.mealChecklist': 'Checklist pasti',
    'dashboard.workoutSummary': 'Regolazione allenamento',
    'dashboard.mealPrepSummary': 'Riepilogo meal prep',
    'dashboard.grocerySummary': 'Riepilogo spesa',
    'dashboard.detailsHint': 'Tocca per aprire i dettagli',
    'dashboard.restDay': 'Riposo/giorno normale',
    'dashboard.workoutDay': 'Giorno allenamento',
    'dashboard.noPlan': 'Nessun piano per oggi',
    'dashboard.generateWeek': 'Genera questa settimana lavorativa',
    'detail.foodAssumptions': 'Assunzioni sugli alimenti',
    'detail.mealContribution': 'Contributo macro per pasto',
    'settings.language': 'Lingua',
    'settings.theme': 'Tema',
    'settings.themeLight': 'Chiaro',
    'settings.themeDark': 'Scuro',
    'settings.themeSystem': 'Sistema',
    'settings.localProfile': 'Profilo locale',
    'settings.localProfileNote': 'Il profilo locale è modalità offline/demo. Gli account di produzione usano Diet Planner Cloud per la sincronizzazione.',
    'settings.usdaApiKey': 'Credenziali provider nutrizionali',
    'settings.usdaApiKeyHelp': 'Le credenziali dei provider esterni sono configurate solo sul backend Diet Planner.',
    'profile.createTitle': 'Crea profilo locale',
    'profile.displayName': 'Nome visualizzato',
    'profile.email': 'Email, opzionale',
    'profile.pin': 'PIN/password, opzionale',
    'profile.continueWithoutPassword': 'Continua senza password',
    'profile.create': 'Crea profilo',
    'profile.logout': 'Esci / cambia profilo',
    'profile.unlock': 'Sblocca profilo',
    'lookup.title': 'Ricerca nutrizionale',
    'lookup.search': 'Cerca alimento',
    'lookup.provider': 'Provider',
    'lookup.auto': 'Auto: priorità Diet Planner Cloud',
    'lookup.localOnly': 'Database locale seed',
    'lookup.usda': 'USDA tramite Diet Planner Cloud',
    'lookup.off': 'Open Food Facts tramite Diet Planner Cloud',
    'lookup.searchButton': 'Cerca dati nutrizionali',
    'lookup.import': 'Importa e modifica dopo',
    'lookup.noResults': 'Nessun valore macro per 100g utilizzabile. Aggiungi il cibo manualmente.',
    'warning.seedValues': 'I valori possono variare per marca e stato crudo/cotto. Verifica le etichette quando serve precisione.'
  }
};

Object.assign(I18N.en, {
  'common.menu': 'Menu',
  'common.back': 'Back',
  'common.status': 'Status',
  'common.enabled': 'Enabled',
  'common.disabled': 'Disabled',
  'common.optional': 'Optional',
  'common.clear': 'Clear',
  'common.analyze': 'Analyze',
  'common.example': 'Example',
  'common.useExample': 'Use example',
  'common.showExample': 'Show example',
  'common.hideExample': 'Hide example',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.create': 'Create',
  'common.duplicate': 'Duplicate',
  'common.saved': 'Saved.',
  'common.notConfigured': 'Not configured',
  'common.savedLocally': 'Saved locally',
  'common.connectionOk': 'Connection OK',
  'common.connectionFailed': 'Connection failed',
  'common.localOnly': 'Local-only',
  'common.importExport': 'Import / export',
  'common.loading': 'Loading',
  'settings.subtitle': 'Manage your profile, app preferences, nutrition sources, and data.',
  'settings.menu.localProfile': 'Local profile',
  'settings.menu.macroTargets': 'Macro targets',
  'settings.menu.baselineDiet': 'Baseline diet',
  'settings.menu.recipeLibrary': 'Recipe library',
  'settings.menu.nutritionSources': 'Nutrition sources',
  'settings.menu.foodDatabase': 'Food database',
  'settings.menu.data': 'Data import/export',
  'settings.menu.preferences': 'App preferences',
  'settings.menu.about': 'About this app',
  'settings.card.open': 'Open detail screen',
  'settings.profile.emailStatus.none': 'No email stored',
  'settings.profile.passwordNone': 'Not enabled',
  'settings.profile.security': 'Security',
  'settings.profile.actions': 'Actions',
  'settings.profile.editProfile': 'Save profile',
  'settings.profile.setPin': 'Set PIN',
  'settings.profile.avatar': 'Profile initials',
  'settings.baseline.title': 'Baseline diet',
  'settings.baseline.description': 'Paste the meal plan from your nutritionist. Use one meal per section. Add quantities when you know them. The app will recognize foods, estimate nutrition values, and ask you to resolve anything unclear.',
  'settings.baseline.hasBaseline': 'Baseline added',
  'settings.baseline.noBaseline': 'No baseline added',
  'settings.baseline.recognized': 'Recognized foods',
  'settings.baseline.unresolved': 'Unresolved foods',
  'settings.baseline.textLabel': 'Nutritionist meal plan text',
  'settings.baseline.analysisTitle': 'Baseline analysis',
  'settings.baseline.reviewTitle': 'Review parsed baseline diet',
  'settings.baseline.reviewHelp': 'Review meal names, foods, quantities, and units. Unknown foods need a matching local food or manual nutrition values.',
  'settings.baseline.unrecognized': 'Could not recognize',
  'settings.baseline.possibleMatches': 'Possible matches',
  'settings.baseline.noItems': 'No items parsed.',
  'settings.baseline.saved': 'Baseline diet saved. Regenerate plans to apply it.',
  'settings.nutrition.title': 'Nutrition sources',
  'settings.nutrition.priority': 'Lookup priority',
  'settings.nutrition.userFoods': 'User custom foods',
  'settings.nutrition.cache': 'Cached imported foods',
  'settings.nutrition.curated': 'Curated local database',
  'settings.nutrition.usdaIfKey': 'USDA FoodData Central through backend-managed credentials',
  'settings.nutrition.offFallback': 'Open Food Facts fallback',
  'settings.nutrition.manual': 'Manual entry',
  'settings.nutrition.usdaHelp': 'USDA FoodData Central is connected by the app owner through server-side environment variables. Users never enter external API keys.',
  'settings.nutrition.getKey': 'Backend environment',
  'settings.nutrition.saveKey': 'Refresh status',
  'settings.nutrition.removeKey': 'Not user-managed',
  'settings.nutrition.testKey': 'Refresh providers',
  'settings.nutrition.offHelp': 'Open Food Facts is called only by Diet Planner Cloud; product data quality varies by product.',
  'settings.nutrition.providerHooks': 'Nutrition providers are connected through Diet Planner Cloud. Browser clients call only Diet Planner backend endpoints.',
  'settings.foodDatabase.title': 'Food database',
  'settings.foodDatabase.summary': '{count} foods available locally',
  'settings.foodDatabase.add': 'Add food',
  'settings.foodDatabase.export': 'Export foods CSV',
  'settings.data.title': 'Data import/export',
  'settings.data.localFirst': 'Data is stored locally in this browser unless exported.',
  'settings.data.exportJson': 'Export backup JSON',
  'settings.data.importJson': 'Import backup JSON',
  'settings.about.title': 'About this app',
  'settings.about.localFirst': 'Users log in to Diet Planner Cloud for multi-device sync. Browser data may still be cached locally for offline use.',
  'settings.about.version': 'Version',
  'settings.preferences.saved': 'Preferences saved.',
  'settings.macroTargets.saved': 'Macro targets saved. Regenerate plans to apply them.',
  'recipe.library': 'Recipe library',
  'recipe.create': 'Create recipe',
  'recipe.edit': 'Edit recipe',
  'recipe.delete': 'Delete recipe',
  'recipe.duplicate': 'Duplicate recipe',
  'recipe.name': 'Recipe name',
  'recipe.mealType': 'Meal type',
  'recipe.servings': 'Servings',
  'recipe.ingredients': 'Ingredients',
  'recipe.instructions': 'Instructions',
  'recipe.notes': 'Notes',
  'recipe.addIngredient': 'Add ingredient',
  'recipe.addAlternative': 'Add alternative',
  'recipe.alternatives': 'Alternatives',
  'recipe.macrosServing': 'Macros per serving',
  'recipe.prepTime': 'Prep time',
  'recipe.cookTime': 'Cook time',
  'recipe.confidence': 'Nutrition confidence',
  'recipe.sourceStatus': 'Source status',
  'recipe.assignMeal': 'Assign to meal type',
  'recipe.search': 'Search recipes',
  'recipe.filterMeal': 'Filter by meal type',
  'recipe.noRecipes': 'No recipes yet.',
  'recipe.saved': 'Recipe saved.',
  'recipe.deleted': 'Recipe deleted.',
  'recipe.duplicated': 'Recipe duplicated.',
  'meal.changeRecipe': 'Change recipe',
  'meal.editMeal': 'Edit meal',
  'meal.recipeViewer': 'Meal recipe',
  'meal.ingredients': 'Ingredients',
  'meal.instructions': 'Instructions',
  'meal.swapIngredient': 'Swap ingredient',
  'meal.recalculateMacros': 'Recalculate macros',
  'meal.swapChanges': 'This swap changes',
  'meal.applyAlternative': 'Apply alternative',
  'meal.noFoods': 'No foods yet',
  'macro.targets': 'Macro targets',
  'macro.dailyCaloriesTarget': 'Daily calories target',
  'macro.dailyProteinTarget': 'Daily protein target',
  'macro.dailyCarbsTarget': 'Daily carbs target',
  'macro.dailyFatTarget': 'Daily fat target',
  'macro.toleranceCalories': 'Calories tolerance %',
  'macro.toleranceProtein': 'Protein tolerance g',
  'macro.toleranceCarbs': 'Carbs tolerance g',
  'macro.toleranceFat': 'Fat tolerance g',
  'macro.optionalTargets': 'Optional workout/rest targets',
  'macro.useWorkout': 'Use workout-day targets',
  'macro.useRest': 'Use rest-day targets',
  'macro.save': 'Save macros',
  'prefs.prepDay': 'Prep day',
  'prefs.lunchMode': 'Lunch mode',
  'prefs.sameLunch': 'Same lunch Monday-Friday',
  'prefs.rotatingLunch': '2-3 rotating work lunches',
  'prefs.baselineLunch': 'Baseline lunch',
  'prefs.units': 'Units',
  'prefs.metric': 'Metric: g/ml/pieces',
  'prefs.likedFoods': 'Foods I like',
  'prefs.dislikedFoods': 'Foods I dislike',
  'prefs.excludedFoods': 'Foods to exclude',
  'prefs.allergies': 'Allergies',
  'prefs.preferredProtein': 'Preferred protein sources',
  'prefs.preferredCarbs': 'Preferred carb sources',
  'prefs.preferredFats': 'Preferred fat sources',
  'table.food': 'Food',
  'table.per100g': 'Per 100g',
  'table.source': 'Source',
  'table.confidence': 'Confidence'
});

Object.assign(I18N.it, {
  'common.menu': 'Menu',
  'common.back': 'Indietro',
  'common.status': 'Stato',
  'common.enabled': 'Attivo',
  'common.disabled': 'Disattivo',
  'common.optional': 'Opzionale',
  'common.clear': 'Cancella',
  'common.analyze': 'Analizza',
  'common.example': 'Esempio',
  'common.useExample': 'Usa esempio',
  'common.showExample': 'Mostra esempio',
  'common.hideExample': 'Nascondi esempio',
  'common.search': 'Cerca',
  'common.filter': 'Filtro',
  'common.create': 'Crea',
  'common.duplicate': 'Duplica',
  'common.saved': 'Salvato.',
  'common.notConfigured': 'Non configurata',
  'common.savedLocally': 'Salvata localmente',
  'common.connectionOk': 'Connessione OK',
  'common.connectionFailed': 'Connessione non riuscita',
  'common.localOnly': 'Solo locale',
  'common.importExport': 'Importa / esporta',
  'common.loading': 'Caricamento',
  'settings.subtitle': 'Gestisci profilo, preferenze, fonti nutrizionali e dati.',
  'settings.menu.localProfile': 'Profilo locale',
  'settings.menu.macroTargets': 'Obiettivi macro',
  'settings.menu.baselineDiet': 'Dieta base',
  'settings.menu.recipeLibrary': 'Ricettario',
  'settings.menu.nutritionSources': 'Fonti nutrizionali',
  'settings.menu.foodDatabase': 'Database alimenti',
  'settings.menu.data': 'Importa/esporta dati',
  'settings.menu.preferences': 'Preferenze app',
  'settings.menu.about': 'Info app',
  'settings.card.open': 'Apri schermata dettagli',
  'settings.profile.emailStatus.none': 'Nessuna email salvata',
  'settings.profile.passwordNone': 'Non attivo',
  'settings.profile.security': 'Sicurezza',
  'settings.profile.actions': 'Azioni',
  'settings.profile.editProfile': 'Salva profilo',
  'settings.profile.setPin': 'Imposta PIN',
  'settings.profile.avatar': 'Iniziali profilo',
  'settings.baseline.title': 'Dieta base',
  'settings.baseline.description': 'Incolla il piano alimentare del nutrizionista. Usa una sezione per ogni pasto. Aggiungi le quantit\u00e0 quando le conosci. L\u2019app riconoscer\u00e0 gli alimenti, stimer\u00e0 i valori nutrizionali e ti chieder\u00e0 di risolvere ci\u00f2 che non \u00e8 chiaro.',
  'settings.baseline.hasBaseline': 'Dieta base aggiunta',
  'settings.baseline.noBaseline': 'Nessuna dieta base aggiunta',
  'settings.baseline.recognized': 'Alimenti riconosciuti',
  'settings.baseline.unresolved': 'Alimenti non risolti',
  'settings.baseline.textLabel': 'Testo del piano alimentare',
  'settings.baseline.analysisTitle': 'Analisi dieta base',
  'settings.baseline.reviewTitle': 'Rivedi dieta base analizzata',
  'settings.baseline.reviewHelp': 'Controlla pasti, alimenti, quantit\u00e0 e unit\u00e0. Gli alimenti sconosciuti richiedono una corrispondenza locale o valori nutrizionali manuali.',
  'settings.baseline.unrecognized': 'Non riconosciuto',
  'settings.baseline.possibleMatches': 'Possibili corrispondenze',
  'settings.baseline.noItems': 'Nessun alimento analizzato.',
  'settings.baseline.saved': 'Dieta base salvata. Rigenera i piani per applicarla.',
  'settings.nutrition.title': 'Fonti nutrizionali',
  'settings.nutrition.priority': 'Priorit\u00e0 ricerca',
  'settings.nutrition.userFoods': 'Alimenti personalizzati',
  'settings.nutrition.cache': 'Alimenti importati in cache',
  'settings.nutrition.curated': 'Database locale curato',
  'settings.nutrition.usdaIfKey': 'USDA FoodData Central tramite credenziali gestite dal backend',
  'settings.nutrition.offFallback': 'Fallback Open Food Facts',
  'settings.nutrition.manual': 'Inserimento manuale',
  'settings.nutrition.usdaHelp': 'USDA FoodData Central è collegato dal proprietario dell’app tramite variabili ambiente server-side. Gli utenti non inseriscono chiavi API esterne.',
  'settings.nutrition.getKey': 'Ambiente backend',
  'settings.nutrition.saveKey': 'Aggiorna stato',
  'settings.nutrition.removeKey': 'Non gestito dall’utente',
  'settings.nutrition.testKey': 'Aggiorna provider',
  'settings.nutrition.offHelp': 'Open Food Facts è chiamato solo da Diet Planner Cloud; la qualità dei dati varia per prodotto.',
  'settings.nutrition.providerHooks': 'I provider nutrizionali sono collegati tramite Diet Planner Cloud. Il browser chiama solo endpoint backend Diet Planner.',
  'settings.foodDatabase.title': 'Database alimenti',
  'settings.foodDatabase.summary': '{count} alimenti disponibili localmente',
  'settings.foodDatabase.add': 'Aggiungi alimento',
  'settings.foodDatabase.export': 'Esporta alimenti CSV',
  'settings.data.title': 'Importa/esporta dati',
  'settings.data.localFirst': 'I dati sono salvati localmente in questo browser salvo esportazione.',
  'settings.data.exportJson': 'Esporta backup JSON',
  'settings.data.importJson': 'Importa backup JSON',
  'settings.about.title': 'Info app',
  'settings.about.localFirst': 'Gli utenti accedono a Diet Planner Cloud per la sincronizzazione multi-dispositivo. I dati possono comunque essere salvati localmente nel browser per l\u2019uso offline.',
  'settings.about.version': 'Versione',
  'settings.preferences.saved': 'Preferenze salvate.',
  'settings.macroTargets.saved': 'Obiettivi macro salvati. Rigenera i piani per applicarli.',
  'recipe.library': 'Ricettario',
  'recipe.create': 'Crea ricetta',
  'recipe.edit': 'Modifica ricetta',
  'recipe.delete': 'Elimina ricetta',
  'recipe.duplicate': 'Duplica ricetta',
  'recipe.name': 'Nome ricetta',
  'recipe.mealType': 'Tipo pasto',
  'recipe.servings': 'Porzioni',
  'recipe.ingredients': 'Ingredienti',
  'recipe.instructions': 'Istruzioni',
  'recipe.notes': 'Note',
  'recipe.addIngredient': 'Aggiungi ingrediente',
  'recipe.addAlternative': 'Aggiungi alternativa',
  'recipe.alternatives': 'Alternative',
  'recipe.macrosServing': 'Macro per porzione',
  'recipe.prepTime': 'Tempo preparazione',
  'recipe.cookTime': 'Tempo cottura',
  'recipe.confidence': 'Affidabilit\u00e0 nutrizionale',
  'recipe.sourceStatus': 'Stato fonte',
  'recipe.assignMeal': 'Assegna a tipo pasto',
  'recipe.search': 'Cerca ricette',
  'recipe.filterMeal': 'Filtra per pasto',
  'recipe.noRecipes': 'Nessuna ricetta.',
  'recipe.saved': 'Ricetta salvata.',
  'recipe.deleted': 'Ricetta eliminata.',
  'recipe.duplicated': 'Ricetta duplicata.',
  'meal.changeRecipe': 'Cambia ricetta',
  'meal.editMeal': 'Modifica pasto',
  'meal.recipeViewer': 'Ricetta pasto',
  'meal.ingredients': 'Ingredienti',
  'meal.instructions': 'Istruzioni',
  'meal.swapIngredient': 'Sostituisci ingrediente',
  'meal.recalculateMacros': 'Ricalcola macro',
  'meal.swapChanges': 'Questa sostituzione cambia',
  'meal.applyAlternative': 'Applica alternativa',
  'meal.noFoods': 'Nessun alimento',
  'macro.targets': 'Obiettivi macro',
  'macro.dailyCaloriesTarget': 'Obiettivo calorie giornaliere',
  'macro.dailyProteinTarget': 'Obiettivo proteine giornaliere',
  'macro.dailyCarbsTarget': 'Obiettivo carboidrati giornalieri',
  'macro.dailyFatTarget': 'Obiettivo grassi giornalieri',
  'macro.toleranceCalories': 'Tolleranza calorie %',
  'macro.toleranceProtein': 'Tolleranza proteine g',
  'macro.toleranceCarbs': 'Tolleranza carboidrati g',
  'macro.toleranceFat': 'Tolleranza grassi g',
  'macro.optionalTargets': 'Obiettivi facoltativi allenamento/riposo',
  'macro.useWorkout': 'Usa obiettivi giorno allenamento',
  'macro.useRest': 'Usa obiettivi giorno riposo',
  'macro.save': 'Salva macro',
  'prefs.prepDay': 'Giorno prep',
  'prefs.lunchMode': 'Modalit\u00e0 pranzo',
  'prefs.sameLunch': 'Stesso pranzo luned\u00ec-venerd\u00ec',
  'prefs.rotatingLunch': '2-3 pranzi lavorativi a rotazione',
  'prefs.baselineLunch': 'Pranzo dieta base',
  'prefs.units': 'Unit\u00e0',
  'prefs.metric': 'Metrico: g/ml/pezzi',
  'prefs.likedFoods': 'Alimenti che mi piacciono',
  'prefs.dislikedFoods': 'Alimenti che non mi piacciono',
  'prefs.excludedFoods': 'Alimenti da escludere',
  'prefs.allergies': 'Allergie',
  'prefs.preferredProtein': 'Fonti proteiche preferite',
  'prefs.preferredCarbs': 'Fonti di carboidrati preferite',
  'prefs.preferredFats': 'Fonti di grassi preferite',
  'table.food': 'Alimento',
  'table.per100g': 'Per 100g',
  'table.source': 'Fonte',
  'table.confidence': 'Affidabilit\u00e0'
});


function getCloudSession() {
  try { return JSON.parse(localStorage.getItem(CLOUD_SESSION_KEY) || 'null'); } catch { return null; }
}

function isCloudSessionActive() {
  return Boolean(getCloudSession()?.user?.id || state.activeProfile?.authMethod === 'diet_planner_cloud');
}

async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || API_TIMEOUT_MS);
  const headers = { Accept: 'application/json', ...(options.headers || {}) };
  const request = {
    method: options.method || 'GET',
    credentials: 'include',
    headers,
    signal: controller.signal,
  };
  const session = getCloudSession();
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    request.body = JSON.stringify(options.body);
  }
  try {
    const response = await fetch(`${API_BASE}${path}`, request);
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();
    if (!response.ok) {
      const message = typeof payload === 'object' ? (payload.error || payload.message || `HTTP ${response.status}`) : (payload || `HTTP ${response.status}`);
      throw new Error(message);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshCloudUser() {
  const session = getCloudSession();
  if (!session) return null;
  try {
    const payload = await apiRequest('/api/users/me', { timeoutMs: 4000 });
    if (payload?.user) {
      const cloudProfile = normalizeCloudProfile(payload.user);
      await idbPut('profiles', cloudProfile);
      localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify({ ...session, user: payload.user }));
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: cloudProfile.id, startedAt: new Date().toISOString(), mode: 'cloud' }));
      return payload.user;
    }
  } catch (error) {
    console.warn('Cloud session refresh failed:', error.message);
  }
  return null;
}

function normalizeCloudProfile(user) {
  return {
    id: `cloud_${user.id}`,
    cloudUserId: user.id,
    displayName: user.name || user.displayName || user.email || 'Cloud User',
    email: user.email || '',
    language: user.language || detectInitialLanguage(),
    theme: user.theme || 'system',
    units: user.units || 'metric',
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
    hasPassword: false,
    passwordHash: '',
    passwordSalt: '',
    authMethod: 'diet_planner_cloud',
    lastLoginAt: new Date().toISOString(),
  };
}

async function refreshNutritionProviders() {
  try {
    const payload = await apiRequest('/api/nutrition/providers', { timeoutMs: 5000 });
    if (Array.isArray(payload?.providers)) {
      state.nutritionProviders = payload.providers;
      for (const provider of payload.providers) await idbPut('nutritionProviders', { ...provider, updatedAt: new Date().toISOString() });
      return payload.providers;
    }
  } catch (error) {
    console.warn('Nutrition provider status unavailable:', error.message);
  }
  return state.nutritionProviders || [];
}


function detectInitialLanguage() {
  const saved = localStorage.getItem('dietPlanner.language');
  if (saved === 'en' || saved === 'it') return saved;
  return (navigator.language || '').toLowerCase().startsWith('it') ? 'it' : 'en';
}

function normalizeLanguage(value) {
  if (value === 'Italian' || value === 'italiano' || value === 'it') return 'it';
  return 'en';
}

function tr(key, vars = {}) {
  const lang = normalizeLanguage(state?.settings?.language || detectInitialLanguage());
  const text = I18N[lang]?.[key] || I18N.en[key] || key;
  return Object.entries(vars).reduce((acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)), text);
}

function mealLabel(slot) {
  return ({ Breakfast: tr('meal.breakfast'), 'Snack 1': tr('meal.snack1'), Lunch: tr('meal.lunch'), 'Snack 2': tr('meal.snack2'), Dinner: tr('meal.dinner') })[slot] || slot;
}

const DEFAULT_SETTINGS = {
  id: 'settings',
  appVersion: APP_VERSION,
  language: detectInitialLanguage(),
  theme: localStorage.getItem('dietPlanner.theme') || 'system',
  prepDay: 'Sunday',
  lunchMode: 'same',
  includeWeekends: false,
  weekendMode: 'flexible',
  units: 'metric',
  mealTimes: Object.fromEntries(MEAL_SLOTS.map((m) => [m.slot, m.time])),
  likedFoods: 'Greek yogurt, skyr, chicken, rice, potatoes, salmon',
  dislikedFoods: '',
  excludedFoods: '',
  allergies: '',
  preferredProtein: 'chicken, fish, skyr, Greek yogurt, eggs, bresaola',
  preferredCarbs: 'rice, oats, potatoes, pasta, fruit, rice cakes',
  preferredFats: 'olive oil, salmon, eggs, almonds',
  groceryDepartmentOrder: DEPARTMENTS,
  workoutMealPreference: 'easy digesting carbs + lean protein, lower fat before training',
  lastExportedAt: null,
};

const SEED_FOODS = [
  foodSeed('greek_yogurt_lowfat', 'Greek yogurt 0-2%', ['greek yogurt', 'greek yoghurt', 'yogurt greco', 'yogurt greco 0', 'yogurt greco 2'], 'g', 100, 59, 10, 3.6, 0.4, 'Dairy & eggs', 'Seed estimate; verify brand label', 'medium', 80, 400),
  foodSeed('oats', 'Oats', ['oats', 'avena', 'fiocchi di avena'], 'g', 100, 389, 16.9, 66.3, 6.9, 'Pasta, rice & grains', 'Seed estimate; verify package label', 'medium', 20, 120),
  foodSeed('banana', 'Banana', ['banana', 'banane'], 'piece', 118, 89, 1.1, 22.8, 0.3, 'Fruit & vegetables', 'Seed estimate; edible portion varies', 'medium', 50, 240),
  foodSeed('skyr', 'Skyr plain', ['skyr', 'icelandic yogurt', 'yogurt islandese'], 'g', 100, 63, 11, 4, 0.2, 'Dairy & eggs', 'Seed estimate; verify brand label', 'medium', 80, 350),
  foodSeed('apple', 'Apple', ['apple', 'mela', 'mele'], 'piece', 182, 52, 0.3, 13.8, 0.2, 'Fruit & vegetables', 'Seed estimate; size varies', 'medium', 90, 260),
  foodSeed('chicken_breast', 'Chicken breast', ['chicken breast', 'petto di pollo', 'pollo', 'chicken'], 'g', 100, 165, 31, 0, 3.6, 'Meat & fish', 'Seed estimate; cooked lean chicken', 'medium', 80, 300),
  foodSeed('rice_dry', 'Rice, dry weight', ['rice', 'riso', 'white rice', 'riso basmati', 'basmati rice'], 'g', 100, 360, 7, 79, 0.6, 'Pasta, rice & grains', 'Seed estimate; dry uncooked rice', 'medium', 40, 160),
  foodSeed('mixed_vegetables', 'Mixed vegetables', ['vegetables', 'verdure', 'mixed vegetables', 'zucchini', 'zucchine', 'broccoli', 'spinach', 'insalata'], 'g', 100, 35, 2, 6, 0.4, 'Fruit & vegetables', 'Seed estimate; varies by vegetable mix', 'low', 100, 600),
  foodSeed('olive_oil', 'Olive oil', ['olive oil', 'olio', 'olio evo', 'olio d oliva', "olio d'oliva", 'extra virgin olive oil'], 'g', 100, 884, 0, 0, 100, 'Pantry & condiments', 'Seed estimate; pure oil', 'high', 0, 30),
  foodSeed('rice_cakes', 'Rice cakes', ['rice cakes', 'gallette', 'gallette di riso', 'rice cake'], 'piece', 9, 387, 8, 81, 3, 'Snacks', 'Seed estimate; check package label', 'medium', 9, 72),
  foodSeed('bresaola', 'Bresaola', ['bresaola'], 'g', 100, 151, 32, 0.5, 2.6, 'Meat & fish', 'Seed estimate; brand varies', 'medium', 30, 120),
  foodSeed('salmon', 'Salmon', ['salmon', 'salmone'], 'g', 100, 208, 20, 0, 13, 'Meat & fish', 'Seed estimate; raw/cooked varies', 'medium', 80, 250),
  foodSeed('potatoes', 'Potatoes', ['potatoes', 'potato', 'patate', 'patata'], 'g', 100, 77, 2, 17, 0.1, 'Fruit & vegetables', 'Seed estimate; raw weight', 'medium', 120, 600),
  foodSeed('eggs', 'Eggs', ['egg', 'eggs', 'uovo', 'uova'], 'piece', 50, 143, 12.6, 0.7, 9.5, 'Dairy & eggs', 'Seed estimate; one medium egg about 50g', 'medium', 50, 250),
  foodSeed('egg_whites', 'Egg whites', ['egg whites', 'albumi', 'albume'], 'g', 100, 52, 11, 0.7, 0.2, 'Dairy & eggs', 'Seed estimate; liquid egg whites', 'medium', 80, 300),
  foodSeed('tuna_natural', 'Tuna, natural', ['tuna', 'tonno', 'tonno al naturale'], 'g', 100, 116, 26, 0, 1, 'Canned goods', 'Seed estimate; drained', 'medium', 60, 180),
  foodSeed('pasta_dry', 'Pasta, dry weight', ['pasta', 'spaghetti', 'penne'], 'g', 100, 360, 13, 72, 1.5, 'Pasta, rice & grains', 'Seed estimate; dry uncooked pasta', 'medium', 50, 160),
  foodSeed('wholegrain_bread', 'Wholegrain bread', ['bread', 'pane', 'wholegrain bread', 'pane integrale'], 'g', 100, 247, 13, 41, 4.2, 'Bakery', 'Seed estimate; brand varies', 'medium', 40, 180),
  foodSeed('whey_protein', 'Whey protein powder', ['whey', 'protein powder', 'proteine whey', 'proteine in polvere'], 'g', 100, 390, 78, 8, 6, 'Supplements / protein products', 'Seed estimate; verify label', 'low', 20, 60),
  foodSeed('almonds', 'Almonds', ['almonds', 'mandorle'], 'g', 100, 579, 21, 22, 50, 'Pantry & condiments', 'Seed estimate', 'medium', 5, 40),
  foodSeed('turkey_slices', 'Turkey breast slices', ['turkey', 'fesa di tacchino', 'turkey breast', 'tacchino'], 'g', 100, 110, 23, 1, 1.5, 'Meat & fish', 'Seed estimate; brand varies', 'medium', 50, 160),
  foodSeed('tomato_sauce', 'Tomato sauce', ['tomato sauce', 'passata', 'passata di pomodoro'], 'g', 100, 33, 1.6, 5.6, 0.2, 'Pantry & condiments', 'Seed estimate', 'medium', 50, 250),
  foodSeed('cottage_cheese', 'Cottage cheese / fiocchi di latte', ['cottage cheese', 'fiocchi di latte'], 'g', 100, 98, 11, 3.4, 4.3, 'Dairy & eggs', 'Seed estimate; brand varies', 'medium', 80, 300),
];


SEED_FOODS.push(...[
  foodSeed('turkey_breast', 'Turkey breast', ['petto di tacchino', 'tacchino', 'turkey'], 'g', 100, 135, 29, 0, 1.5, 'Meat & fish', 'Curated lean turkey breast estimate', 'high', 80, 300),
  foodSeed('lean_beef', 'Lean beef', ['manzo magro', 'beef', 'bovino magro'], 'g', 100, 170, 26, 0, 7, 'Meat & fish', 'Curated lean beef estimate', 'medium', 80, 250),
  foodSeed('cod', 'Cod', ['merluzzo', 'cod fish'], 'g', 100, 82, 18, 0, 0.7, 'Meat & fish', 'Curated white fish estimate', 'high', 100, 300),
  foodSeed('sea_bass', 'Sea bass', ['branzino', 'spigola', 'sea bass'], 'g', 100, 124, 23, 0, 3, 'Meat & fish', 'Curated fish estimate', 'medium', 100, 300),
  foodSeed('greek_yogurt_0', 'Greek yogurt 0%', ['yogurt greco 0%', 'greek yogurt zero fat'], 'g', 100, 57, 10.3, 3.6, 0.2, 'Dairy & eggs', 'Curated plain 0% Greek yogurt estimate', 'high', 100, 400),
  foodSeed('greek_yogurt_2', 'Greek yogurt 2%', ['yogurt greco 2%', 'greek yogurt 2 percent'], 'g', 100, 73, 9.8, 3.8, 2, 'Dairy & eggs', 'Curated plain 2% Greek yogurt estimate', 'medium', 100, 400),
  foodSeed('ricotta', 'Ricotta', ['ricotta vaccina'], 'g', 100, 174, 11.3, 3, 13, 'Dairy & eggs', 'Curated ricotta estimate', 'medium', 50, 250),
  foodSeed('tofu', 'Tofu', ['tofu naturale'], 'g', 100, 144, 17, 3, 8.7, 'Dairy & eggs', 'Curated firm tofu estimate', 'medium', 80, 300),
  foodSeed('tempeh', 'Tempeh', ['tempeh naturale'], 'g', 100, 192, 20.3, 7.6, 10.8, 'Dairy & eggs', 'Curated tempeh estimate', 'medium', 80, 250),
  foodSeed('lentils_cooked', 'Lentils, cooked', ['lenticchie', 'lenticchie cotte'], 'g', 100, 116, 9, 20, 0.4, 'Canned goods', 'Curated cooked lentil estimate', 'high', 80, 300),
  foodSeed('chickpeas_cooked', 'Chickpeas, cooked', ['ceci', 'ceci cotti'], 'g', 100, 164, 8.9, 27.4, 2.6, 'Canned goods', 'Curated cooked chickpea estimate', 'high', 80, 300),
  foodSeed('beans_cooked', 'Beans, cooked', ['fagioli', 'fagioli cotti'], 'g', 100, 127, 8.7, 22.8, 0.5, 'Canned goods', 'Curated cooked bean estimate', 'high', 80, 300),
  foodSeed('basmati_rice_dry', 'Basmati rice, dry', ['riso basmati', 'basmati'], 'g', 100, 356, 8.2, 78, 0.8, 'Pasta, rice & grains', 'Curated dry rice estimate', 'high', 40, 160),
  foodSeed('brown_rice_dry', 'Brown rice, dry', ['riso integrale', 'brown rice'], 'g', 100, 370, 7.9, 77.2, 2.9, 'Pasta, rice & grains', 'Curated dry brown rice estimate', 'high', 40, 160),
  foodSeed('whole_wheat_pasta_dry', 'Whole wheat pasta, dry', ['pasta integrale', 'whole wheat pasta'], 'g', 100, 348, 13.5, 66, 2.5, 'Pasta, rice & grains', 'Curated dry whole wheat pasta estimate', 'medium', 50, 160),
  foodSeed('bread_white', 'Bread', ['pane', 'pane bianco'], 'g', 100, 265, 9, 49, 3.2, 'Bakery', 'Curated bread estimate', 'medium', 30, 180),
  foodSeed('sweet_potatoes', 'Sweet potatoes', ['patate dolci', 'batate'], 'g', 100, 86, 1.6, 20, 0.1, 'Fruit & vegetables', 'Curated raw sweet potato estimate', 'high', 120, 600),
  foodSeed('couscous_dry', 'Couscous, dry', ['cous cous', 'couscous'], 'g', 100, 376, 12.8, 77.4, 0.6, 'Pasta, rice & grains', 'Curated dry couscous estimate', 'medium', 40, 140),
  foodSeed('quinoa_dry', 'Quinoa, dry', ['quinoa'], 'g', 100, 368, 14.1, 64.2, 6.1, 'Pasta, rice & grains', 'Curated dry quinoa estimate', 'medium', 40, 140),
  foodSeed('corn_flakes', 'Corn flakes', ['fiocchi di mais', 'cornflakes'], 'g', 100, 357, 7.5, 84, 0.4, 'Pasta, rice & grains', 'Curated cereal estimate; brand varies', 'medium', 20, 100),
  foodSeed('orange', 'Orange', ['arancia', 'arance'], 'piece', 131, 47, 0.9, 11.8, 0.1, 'Fruit & vegetables', 'Curated fruit estimate', 'high', 80, 260),
  foodSeed('berries', 'Berries', ['frutti di bosco', 'berries', 'mirtilli', 'lamponi'], 'g', 100, 57, 0.7, 14.5, 0.3, 'Fruit & vegetables', 'Curated mixed berry estimate', 'medium', 50, 250),
  foodSeed('honey', 'Honey', ['miele'], 'g', 100, 304, 0.3, 82.4, 0, 'Pantry & condiments', 'Curated honey estimate', 'high', 0, 40),
  foodSeed('jam', 'Jam', ['marmellata', 'confettura'], 'g', 100, 250, 0.4, 60, 0.1, 'Pantry & condiments', 'Curated jam estimate; brand varies', 'medium', 0, 50),
  foodSeed('avocado', 'Avocado', ['avocado'], 'g', 100, 160, 2, 8.5, 14.7, 'Fruit & vegetables', 'Curated avocado estimate', 'high', 30, 150),
  foodSeed('walnuts', 'Walnuts', ['noci'], 'g', 100, 654, 15.2, 13.7, 65.2, 'Pantry & condiments', 'Curated walnut estimate', 'high', 5, 40),
  foodSeed('peanut_butter', 'Peanut butter', ['burro di arachidi'], 'g', 100, 588, 25, 20, 50, 'Pantry & condiments', 'Curated peanut butter estimate; brand varies', 'medium', 5, 40),
  foodSeed('pistachios', 'Pistachios', ['pistacchi'], 'g', 100, 562, 20.2, 27.2, 45.3, 'Pantry & condiments', 'Curated pistachio estimate', 'high', 5, 40),
  foodSeed('butter', 'Butter', ['burro'], 'g', 100, 717, 0.9, 0.1, 81, 'Dairy & eggs', 'Curated butter estimate', 'high', 0, 25),
  foodSeed('parmesan', 'Parmesan', ['parmigiano', 'grana', 'parmesan cheese'], 'g', 100, 431, 38, 4.1, 29, 'Dairy & eggs', 'Curated parmesan estimate', 'medium', 5, 40),
  foodSeed('dark_chocolate', 'Dark chocolate', ['cioccolato fondente'], 'g', 100, 546, 4.9, 61, 31, 'Snacks', 'Curated dark chocolate estimate; cocoa % varies', 'medium', 5, 40),
  foodSeed('broccoli', 'Broccoli', ['broccoli'], 'g', 100, 34, 2.8, 6.6, 0.4, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 80, 400),
  foodSeed('zucchini', 'Zucchini', ['zucchine', 'zucchina'], 'g', 100, 17, 1.2, 3.1, 0.3, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 80, 400),
  foodSeed('spinach', 'Spinach', ['spinaci'], 'g', 100, 23, 2.9, 3.6, 0.4, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 300),
  foodSeed('lettuce', 'Lettuce', ['lattuga', 'insalata'], 'g', 100, 15, 1.4, 2.9, 0.2, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 300),
  foodSeed('tomatoes', 'Tomatoes', ['pomodori', 'pomodoro'], 'g', 100, 18, 0.9, 3.9, 0.2, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 400),
  foodSeed('carrots', 'Carrots', ['carote', 'carota'], 'g', 100, 41, 0.9, 9.6, 0.2, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 300),
  foodSeed('peppers', 'Peppers', ['peperoni', 'peperone'], 'g', 100, 31, 1, 6, 0.3, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 350),
  foodSeed('green_beans', 'Green beans', ['fagiolini'], 'g', 100, 31, 1.8, 7, 0.2, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 80, 400),
  foodSeed('mushrooms', 'Mushrooms', ['funghi'], 'g', 100, 22, 3.1, 3.3, 0.3, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 300),
  foodSeed('eggplant', 'Eggplant', ['melanzana', 'melanzane'], 'g', 100, 25, 1, 5.9, 0.2, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 80, 400),
  foodSeed('milk', 'Milk', ['latte', 'latte vaccino'], 'ml', 100, 64, 3.3, 4.8, 3.6, 'Dairy & eggs', 'Curated whole milk estimate', 'medium', 50, 500),
  foodSeed('lactose_free_milk', 'Lactose-free milk', ['latte senza lattosio'], 'ml', 100, 46, 3.4, 4.9, 1.5, 'Dairy & eggs', 'Curated semi-skim lactose-free milk estimate', 'medium', 50, 500),
  foodSeed('soy_milk', 'Soy milk', ['latte di soia', 'bevanda di soia'], 'ml', 100, 33, 3.3, 0.7, 1.8, 'Dairy & eggs', 'Curated unsweetened soy drink estimate', 'medium', 50, 500),
  foodSeed('almond_milk', 'Almond milk', ['latte di mandorla', 'bevanda di mandorla'], 'ml', 100, 15, 0.6, 0.3, 1.2, 'Dairy & eggs', 'Curated unsweetened almond drink estimate', 'medium', 50, 500),
  foodSeed('protein_pudding', 'Protein pudding', ['budino proteico', 'protein pudding'], 'g', 100, 76, 10, 6, 1.5, 'Supplements / protein products', 'Curated product estimate; brand varies', 'low', 100, 250),
  foodSeed('protein_bar', 'Protein bar', ['barretta proteica'], 'piece', 55, 364, 36, 27, 12, 'Supplements / protein products', 'Curated product estimate; brand varies', 'low', 25, 100),
  foodSeed('crackers', 'Crackers', ['cracker', 'crackers integrali'], 'g', 100, 430, 10, 70, 12, 'Snacks', 'Curated cracker estimate; brand varies', 'medium', 20, 100),
  foodSeed('cereals', 'Cereals', ['cereali', 'cereal'], 'g', 100, 380, 8, 78, 4, 'Pasta, rice & grains', 'Curated cereal estimate; brand varies', 'medium', 20, 100),
]);

const RECIPE_LIBRARY = [
  recipe('preworkout_skyr_banana', 'Snack 2', 'Pre-workout skyr, banana and rice cakes', [
    ['skyr', 170, 'g'],
    ['banana', 1, 'piece'],
    ['rice_cakes', 3, 'piece'],
  ], ['Mix skyr in a bowl.', 'Eat banana and rice cakes 60–120 minutes before training.', 'Keep fat low to make digestion easier.'], 5, 0, 'Best eaten fresh.'),
  recipe('breakfast_yogurt_oats', 'Breakfast', 'Greek yogurt oats bowl', [
    ['greek_yogurt_lowfat', 250, 'g'],
    ['oats', 45, 'g'],
    ['banana', 1, 'piece'],
  ], ['Combine yogurt and oats.', 'Slice banana on top.', 'Optional: chill overnight.'], 5, 0, 'Can be prepared the night before.'),
  recipe('breakfast_eggs_bread', 'Breakfast', 'Eggs and wholegrain toast', [
    ['eggs', 2, 'piece'],
    ['egg_whites', 150, 'g'],
    ['wholegrain_bread', 80, 'g'],
  ], ['Scramble eggs and egg whites.', 'Toast bread.', 'Serve with salt and vegetables if desired.'], 8, 8, 'Cook eggs fresh.'),
  recipe('snack_skyr_apple', 'Snack 1', 'Skyr and apple', [
    ['skyr', 170, 'g'],
    ['apple', 1, 'piece'],
  ], ['Open skyr.', 'Eat with apple.'], 2, 0, 'Portable snack.'),
  recipe('snack_bresaola_ricecakes', 'Snack 2', 'Bresaola rice cakes', [
    ['rice_cakes', 4, 'piece'],
    ['bresaola', 60, 'g'],
  ], ['Top rice cakes with bresaola.', 'Eat immediately to keep rice cakes crisp.'], 4, 0, 'Pack separately.'),
  recipe('snack_whey_banana', 'Snack 2', 'Whey shake and banana', [
    ['whey_protein', 30, 'g'],
    ['banana', 1, 'piece'],
    ['rice_cakes', 2, 'piece'],
  ], ['Shake whey with water.', 'Eat with banana and rice cakes.'], 3, 0, 'Good pre-workout option.'),
  recipe('lunch_chicken_rice', 'Lunch', 'Chicken rice meal prep bowl', [
    ['chicken_breast', 180, 'g'],
    ['rice_dry', 80, 'g'],
    ['mixed_vegetables', 250, 'g'],
    ['olive_oil', 10, 'g'],
  ], ['Cook rice.', 'Grill or pan-cook chicken.', 'Cook vegetables.', 'Portion and add olive oil after reheating.'], 12, 25, 'Fridge 3 days; freeze later portions.'),
  recipe('lunch_tuna_pasta', 'Lunch', 'Tuna tomato pasta', [
    ['pasta_dry', 90, 'g'],
    ['tuna_natural', 120, 'g'],
    ['tomato_sauce', 150, 'g'],
    ['olive_oil', 8, 'g'],
    ['mixed_vegetables', 150, 'g'],
  ], ['Cook pasta.', 'Warm tomato sauce and vegetables.', 'Add drained tuna.', 'Finish with olive oil.'], 8, 15, 'Good for 2–3 fridge days.'),
  recipe('lunch_turkey_potato', 'Lunch', 'Turkey and potato bowl', [
    ['turkey_slices', 130, 'g'],
    ['potatoes', 350, 'g'],
    ['mixed_vegetables', 250, 'g'],
    ['olive_oil', 12, 'g'],
  ], ['Boil or roast potatoes.', 'Add turkey slices after reheating.', 'Serve with vegetables and olive oil.'], 10, 25, 'Keep turkey separate if preferred.'),
  recipe('dinner_salmon_potatoes', 'Dinner', 'Salmon, potatoes and vegetables', [
    ['salmon', 150, 'g'],
    ['potatoes', 300, 'g'],
    ['mixed_vegetables', 250, 'g'],
  ], ['Bake salmon.', 'Boil or roast potatoes.', 'Steam or sauté vegetables.'], 10, 25, 'Best fresh; leftovers up to 2 days.'),
  recipe('dinner_chicken_pasta', 'Dinner', 'Chicken pasta and vegetables', [
    ['chicken_breast', 170, 'g'],
    ['pasta_dry', 90, 'g'],
    ['mixed_vegetables', 250, 'g'],
    ['olive_oil', 10, 'g'],
  ], ['Cook pasta.', 'Cook chicken and vegetables.', 'Combine and add olive oil.'], 10, 20, 'Meal-prep friendly.'),
  recipe('dinner_egg_potato', 'Dinner', 'Egg white omelet and potatoes', [
    ['eggs', 2, 'piece'],
    ['egg_whites', 180, 'g'],
    ['potatoes', 330, 'g'],
    ['mixed_vegetables', 250, 'g'],
  ], ['Cook potatoes.', 'Make omelet with eggs and egg whites.', 'Serve with vegetables.'], 10, 20, 'Cook omelet fresh.'),
];


SEED_FOODS.push(
  foodSeed('rice_cooked', 'Cooked white rice', ['cooked rice', 'riso cotto', 'riso bianco cotto'], 'g', 100, 130, 2.7, 28.2, 0.3, 'Pasta, rice & grains', 'Curated cooked rice estimate', 'medium', 80, 450, { displayNameIt: 'Riso bianco cotto', rawOrCookedState: 'cooked' }),
  foodSeed('pasta_cooked', 'Cooked pasta', ['pasta cotta', 'cooked pasta'], 'g', 100, 158, 5.8, 30.9, 0.9, 'Pasta, rice & grains', 'Curated cooked pasta estimate', 'medium', 80, 450, { displayNameIt: 'Pasta cotta', rawOrCookedState: 'cooked' }),
  foodSeed('couscous_dry', 'Couscous dry', ['couscous', 'cuscus secco'], 'g', 100, 376, 12.8, 77.4, 0.6, 'Pasta, rice & grains', 'Curated dry couscous estimate', 'medium', 40, 140, { displayNameIt: 'Couscous secco', rawOrCookedState: 'dry_raw' }),
  foodSeed('quinoa_dry', 'Quinoa dry', ['quinoa', 'quinoa secca'], 'g', 100, 368, 14.1, 64.2, 6.1, 'Pasta, rice & grains', 'Curated dry quinoa estimate', 'medium', 40, 140, { displayNameIt: 'Quinoa secca', rawOrCookedState: 'dry_raw' }),
  foodSeed('farro_dry', 'Spelt/farro dry', ['farro', 'farro secco', 'spelt'], 'g', 100, 335, 15.1, 67.1, 2.5, 'Pasta, rice & grains', 'Curated dry farro estimate', 'medium', 40, 140, { displayNameIt: 'Farro secco', rawOrCookedState: 'dry_raw' }),
  foodSeed('barley_dry', 'Barley dry', ['orzo perlato', 'barley', 'orzo secco'], 'g', 100, 354, 12.5, 73.5, 2.3, 'Pasta, rice & grains', 'Curated dry barley estimate', 'medium', 40, 140, { displayNameIt: 'Orzo perlato secco', rawOrCookedState: 'dry_raw' }),
  foodSeed('cornflakes', 'Corn flakes', ['corn flakes', 'fiocchi di mais'], 'g', 100, 357, 7.5, 84, 0.4, 'Pasta, rice & grains', 'Curated cereal estimate; brand varies', 'medium', 20, 100, { displayNameIt: 'Fiocchi di mais' }),
  foodSeed('muesli', 'Muesli', ['muesli', 'musli'], 'g', 100, 360, 10, 64, 7, 'Pasta, rice & grains', 'Curated muesli estimate; brand varies', 'medium', 30, 120, { displayNameIt: 'Muesli' }),
  foodSeed('wrap_integrale', 'Wholegrain wrap', ['wholegrain wrap', 'piadina integrale', 'wrap integrale'], 'piece', 70, 300, 9, 46, 8, 'Bakery', 'Curated wrap estimate; brand varies', 'medium', 35, 140, { displayNameIt: 'Piadina integrale' }),
  foodSeed('pane_segale', 'Rye bread', ['rye bread', 'pane di segale'], 'g', 100, 259, 8.5, 48.3, 3.3, 'Bakery', 'Curated bread estimate; brand varies', 'medium', 30, 180, { displayNameIt: 'Pane di segale' }),
  foodSeed('pane_bianco', 'White bread', ['white bread', 'pane bianco'], 'g', 100, 265, 9, 49, 3.2, 'Bakery', 'Curated bread estimate; brand varies', 'medium', 30, 180, { displayNameIt: 'Pane bianco' }),
  foodSeed('fette_biscottate', 'Rusks', ['rusks', 'fette biscottate'], 'g', 100, 410, 11, 76, 6, 'Bakery', 'Curated rusk estimate; brand varies', 'medium', 15, 80, { displayNameIt: 'Fette biscottate' }),
  foodSeed('gnocchi_potato', 'Potato gnocchi', ['gnocchi', 'gnocchi di patate'], 'g', 100, 150, 4, 31, 0.6, 'Pasta, rice & grains', 'Curated gnocchi estimate; brand varies', 'medium', 100, 350, { displayNameIt: 'Gnocchi di patate' }),
  foodSeed('beef_lean_raw', 'Lean beef', ['lean beef', 'manzo magro', 'bovino magro'], 'g', 100, 176, 21, 0, 10, 'Meat & fish', 'Curated lean beef estimate', 'medium', 80, 300, { displayNameIt: 'Manzo magro', rawOrCookedState: 'raw_or_cooked_varies' }),
  foodSeed('pork_loin', 'Pork loin', ['pork loin', 'lonza di maiale'], 'g', 100, 143, 21, 0, 5.5, 'Meat & fish', 'Curated pork loin estimate', 'medium', 80, 300, { displayNameIt: 'Lonza di maiale', rawOrCookedState: 'raw_or_cooked_varies' }),
  foodSeed('ham_cooked', 'Cooked ham', ['cooked ham', 'prosciutto cotto'], 'g', 100, 145, 20, 1, 6, 'Meat & fish', 'Curated deli meat estimate; brand varies', 'medium', 30, 180, { displayNameIt: 'Prosciutto cotto' }),
  foodSeed('ham_raw', 'Cured ham', ['cured ham', 'prosciutto crudo'], 'g', 100, 269, 26, 0, 18, 'Meat & fish', 'Curated cured meat estimate; brand varies', 'medium', 20, 120, { displayNameIt: 'Prosciutto crudo' }),
  foodSeed('chicken_thigh', 'Chicken thigh', ['chicken thigh', 'sovracoscia di pollo', 'coscia di pollo'], 'g', 100, 209, 26, 0, 10.9, 'Meat & fish', 'Curated chicken thigh estimate', 'medium', 80, 350, { displayNameIt: 'Coscia di pollo', rawOrCookedState: 'raw_or_cooked_varies' }),
  foodSeed('shrimp', 'Shrimp', ['shrimp', 'gamberi', 'gamberetti'], 'g', 100, 99, 24, 0.2, 0.3, 'Meat & fish', 'Curated shrimp estimate', 'medium', 80, 300, { displayNameIt: 'Gamberi' }),
  foodSeed('sea_bass', 'Sea bass', ['sea bass', 'branzino', 'spigola'], 'g', 100, 124, 23.6, 0, 2.6, 'Meat & fish', 'Curated sea bass estimate', 'medium', 100, 350, { displayNameIt: 'Branzino' }),
  foodSeed('anchovies', 'Anchovies', ['anchovies', 'acciughe', 'alici'], 'g', 100, 131, 20.4, 0, 4.8, 'Meat & fish', 'Curated anchovy estimate', 'medium', 20, 160, { displayNameIt: 'Alici' }),
  foodSeed('sardines', 'Sardines', ['sardines', 'sarde', 'sardine'], 'g', 100, 208, 24.6, 0, 11.5, 'Meat & fish', 'Curated sardine estimate', 'medium', 80, 260, { displayNameIt: 'Sardine' }),
  foodSeed('tuna_olive_oil', 'Tuna in olive oil drained', ['tuna in oil', 'tonno sottolio sgocciolato'], 'g', 100, 198, 29, 0, 8, 'Canned goods', 'Curated canned tuna estimate; brand varies', 'medium', 50, 200, { displayNameIt: 'Tonno sottolio sgocciolato' }),
  foodSeed('ricotta_light', 'Light ricotta', ['light ricotta', 'ricotta light'], 'g', 100, 138, 11, 4, 8, 'Dairy & eggs', 'Curated ricotta estimate; brand varies', 'medium', 50, 250, { displayNameIt: 'Ricotta light' }),
  foodSeed('cottage_cheese', 'Cottage cheese', ['cottage cheese', 'fiocchi di latte'], 'g', 100, 98, 11, 3.4, 4.3, 'Dairy & eggs', 'Curated cottage cheese estimate; brand varies', 'medium', 80, 300, { displayNameIt: 'Fiocchi di latte' }),
  foodSeed('mozzarella_light', 'Light mozzarella', ['light mozzarella', 'mozzarella light'], 'g', 100, 163, 20, 2, 8, 'Dairy & eggs', 'Curated mozzarella estimate; brand varies', 'medium', 50, 250, { displayNameIt: 'Mozzarella light' }),
  foodSeed('parmigiano', 'Parmigiano Reggiano', ['parmigiano', 'parmesan', 'grana'], 'g', 100, 402, 32, 0, 30, 'Dairy & eggs', 'Curated hard cheese estimate', 'medium', 5, 80, { displayNameIt: 'Parmigiano Reggiano' }),
  foodSeed('kefir_plain', 'Plain kefir', ['kefir', 'kefir bianco'], 'ml', 100, 52, 3.4, 4.7, 2.5, 'Dairy & eggs', 'Curated kefir estimate; brand varies', 'medium', 100, 500, { displayNameIt: 'Kefir bianco' }),
  foodSeed('chickpeas_cooked', 'Chickpeas cooked', ['chickpeas cooked', 'ceci cotti', 'ceci lessati'], 'g', 100, 164, 8.9, 27.4, 2.6, 'Canned goods', 'Curated cooked chickpea estimate', 'medium', 80, 300, { displayNameIt: 'Ceci cotti', rawOrCookedState: 'cooked' }),
  foodSeed('black_beans_cooked', 'Black beans cooked', ['black beans', 'fagioli neri cotti'], 'g', 100, 132, 8.9, 23.7, 0.5, 'Canned goods', 'Curated cooked bean estimate', 'medium', 80, 300, { displayNameIt: 'Fagioli neri cotti', rawOrCookedState: 'cooked' }),
  foodSeed('lentils_dry', 'Lentils dry', ['dry lentils', 'lenticchie secche'], 'g', 100, 353, 25.8, 60.1, 1.1, 'Pasta, rice & grains', 'Curated dry lentil estimate', 'medium', 40, 120, { displayNameIt: 'Lenticchie secche', rawOrCookedState: 'dry_raw' }),
  foodSeed('peas_frozen', 'Frozen peas', ['frozen peas', 'piselli surgelati'], 'g', 100, 81, 5.4, 14.5, 0.4, 'Frozen', 'Curated frozen pea estimate', 'medium', 80, 300, { displayNameIt: 'Piselli surgelati' }),
  foodSeed('edamame', 'Edamame', ['edamame', 'fagioli di soia edamame'], 'g', 100, 121, 11.9, 8.9, 5.2, 'Frozen', 'Curated edamame estimate', 'medium', 80, 250, { displayNameIt: 'Edamame' }),
  foodSeed('tofu_firm', 'Firm tofu', ['tofu', 'tofu compatto'], 'g', 100, 144, 15.7, 3.9, 8.7, 'Dairy & eggs', 'Curated tofu estimate; brand varies', 'medium', 80, 300, { displayNameIt: 'Tofu compatto' }),
  foodSeed('tempeh', 'Tempeh', ['tempeh'], 'g', 100, 193, 19, 9, 11, 'Dairy & eggs', 'Curated tempeh estimate; brand varies', 'medium', 80, 250, { displayNameIt: 'Tempeh' }),
  foodSeed('kiwi', 'Kiwi', ['kiwi'], 'piece', 75, 61, 1.1, 14.7, 0.5, 'Fruit & vegetables', 'Curated fruit estimate', 'medium', 50, 250, { displayNameIt: 'Kiwi' }),
  foodSeed('orange', 'Orange', ['orange', 'arancia', 'arance'], 'piece', 140, 47, 0.9, 11.8, 0.1, 'Fruit & vegetables', 'Curated fruit estimate', 'medium', 80, 300, { displayNameIt: 'Arancia' }),
  foodSeed('berries', 'Mixed berries', ['berries', 'frutti di bosco'], 'g', 100, 50, 1, 12, 0.3, 'Fruit & vegetables', 'Curated berry estimate', 'medium', 50, 300, { displayNameIt: 'Frutti di bosco' }),
  foodSeed('grapes', 'Grapes', ['grapes', 'uva'], 'g', 100, 69, 0.7, 18.1, 0.2, 'Fruit & vegetables', 'Curated fruit estimate', 'medium', 50, 300, { displayNameIt: 'Uva' }),
  foodSeed('avocado', 'Avocado', ['avocado'], 'g', 100, 160, 2, 8.5, 14.7, 'Fruit & vegetables', 'Curated avocado estimate', 'medium', 40, 200, { displayNameIt: 'Avocado' }),
  foodSeed('asparagus', 'Asparagus', ['asparagus', 'asparagi'], 'g', 100, 20, 2.2, 3.9, 0.1, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 300, { displayNameIt: 'Asparagi' }),
  foodSeed('spinach', 'Spinach', ['spinach', 'spinaci'], 'g', 100, 23, 2.9, 3.6, 0.4, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 50, 350, { displayNameIt: 'Spinaci' }),
  foodSeed('cauliflower', 'Cauliflower', ['cauliflower', 'cavolfiore'], 'g', 100, 25, 1.9, 5, 0.3, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 80, 400, { displayNameIt: 'Cavolfiore' }),
  foodSeed('pumpkin', 'Pumpkin', ['pumpkin', 'zucca'], 'g', 100, 26, 1, 6.5, 0.1, 'Fruit & vegetables', 'Curated vegetable estimate', 'high', 80, 400, { displayNameIt: 'Zucca' }),
  foodSeed('sweet_potato', 'Sweet potato', ['sweet potato', 'patata dolce'], 'g', 100, 86, 1.6, 20.1, 0.1, 'Fruit & vegetables', 'Curated sweet potato estimate', 'medium', 100, 400, { displayNameIt: 'Patata dolce' }),
  foodSeed('peanut_butter', 'Peanut butter', ['peanut butter', 'burro di arachidi'], 'g', 100, 588, 25, 20, 50, 'Pantry & condiments', 'Curated peanut butter estimate; brand varies', 'medium', 5, 60, { displayNameIt: 'Burro di arachidi' }),
  foodSeed('cashews', 'Cashews', ['cashews', 'anacardi'], 'g', 100, 553, 18, 30, 44, 'Snacks', 'Curated nut estimate', 'medium', 10, 80, { displayNameIt: 'Anacardi' }),
  foodSeed('chia_seeds', 'Chia seeds', ['chia seeds', 'semi di chia'], 'g', 100, 486, 16.5, 42.1, 30.7, 'Snacks', 'Curated seed estimate', 'medium', 5, 40, { displayNameIt: 'Semi di chia' }),
  foodSeed('flaxseed', 'Flaxseed', ['flaxseed', 'semi di lino'], 'g', 100, 534, 18.3, 28.9, 42.2, 'Snacks', 'Curated seed estimate', 'medium', 5, 40, { displayNameIt: 'Semi di lino' }),
  foodSeed('dark_chocolate_85', 'Dark chocolate 85%', ['dark chocolate 85', 'cioccolato fondente 85'], 'g', 100, 598, 12, 19, 52, 'Snacks', 'Curated chocolate estimate; brand varies', 'low', 5, 50, { displayNameIt: 'Cioccolato fondente 85%' }),
  foodSeed('honey', 'Honey', ['honey', 'miele'], 'g', 100, 304, 0.3, 82.4, 0, 'Pantry & condiments', 'Curated honey estimate', 'medium', 5, 60, { displayNameIt: 'Miele' }),
  foodSeed('jam', 'Jam', ['jam', 'marmellata', 'confettura'], 'g', 100, 250, 0.3, 63, 0.1, 'Pantry & condiments', 'Curated jam estimate; brand varies', 'low', 5, 70, { displayNameIt: 'Marmellata' }),
  foodSeed('pesto', 'Pesto', ['pesto', 'pesto genovese'], 'g', 100, 470, 5, 6, 46, 'Pantry & condiments', 'Curated pesto estimate; brand varies', 'low', 5, 80, { displayNameIt: 'Pesto genovese' }),
  foodSeed('soy_sauce', 'Soy sauce', ['soy sauce', 'salsa di soia'], 'ml', 100, 53, 8, 4.9, 0.6, 'Pantry & condiments', 'Curated soy sauce estimate; sodium varies', 'medium', 5, 50, { displayNameIt: 'Salsa di soia' }),
  foodSeed('whey_isolate', 'Whey isolate', ['whey isolate', 'proteine isolate', 'whey isolata'], 'g', 100, 370, 86, 3, 1, 'Supplements / protein products', 'Curated whey isolate estimate; brand varies', 'medium', 15, 60, { displayNameIt: 'Proteine whey isolate' }),
  foodSeed('casein_protein', 'Casein protein', ['casein', 'caseina', 'proteine caseina'], 'g', 100, 360, 80, 8, 2, 'Supplements / protein products', 'Curated casein estimate; brand varies', 'medium', 15, 60, { displayNameIt: 'Caseina' }),
  foodSeed('mass_gainer', 'Mass gainer powder', ['mass gainer', 'gainer'], 'g', 100, 390, 20, 68, 4, 'Supplements / protein products', 'Curated product estimate; brand varies', 'low', 30, 150, { displayNameIt: 'Mass gainer' })
);

const NUTRITION_PROVIDERS = [
  { id: 'custom_foods', name: 'User custom foods', requiresApiKey: false, priority: 1 },
  { id: 'cache', name: 'Cached imported foods', requiresApiKey: false, priority: 2 },
  { id: 'curated_seed', name: 'Curated local database', requiresApiKey: false, priority: 3 },
  { id: 'usda_fdc', name: 'USDA FoodData Central through Diet Planner Cloud', requiresApiKey: true, priority: 4 },
  { id: 'open_food_facts', name: 'Open Food Facts through Diet Planner Cloud', requiresApiKey: false, priority: 5 },
  { id: 'manual', name: 'Manual entry', requiresApiKey: false, priority: 6 }
];

const MARKER_NAMES = [
  'Glucose', 'Insulin', 'HbA1c', 'Total cholesterol', 'HDL', 'LDL', 'Triglycerides', 'AST', 'ALT', 'GGT',
  'Creatinine', 'eGFR', 'Ferritin', 'Vitamin D', 'B12', 'TSH', 'CRP', 'Testosterone', 'Free testosterone', 'Cortisol',
];

const state = {
  db: null,
  view: localStorage.getItem('dietPlanner.view') || 'today',
  settings: null,
  target: null,
  foods: [],
  baseline: null,
  plans: [],
  bodyEntries: [],
  bloodExams: [],
  lookupResults: [],
  profiles: [],
  activeProfile: null,
  activeUserId: null,
  needsOnboarding: false,
  detailFocusReturn: null,
  deferredInstallPrompt: null,
};

function foodSeed(id, name, aliases, defaultUnit, unitGrams, calories, protein, carbs, fat, department, source, confidence, minG = 0, maxG = 1000, extra = {}) {
  const now = new Date().toISOString();
  const itAlias = (aliases || []).find((a) => /[àèéìòù]|pollo|riso|pasta|tonno|patate|uovo|olio|yogurt|pane|verdure|latte|mandorle|noci|manzo|tacchino|merluzzo|salmone|ceci|fagioli|lenticchie|miele|marmellata/i.test(a));
  return {
    id,
    name,
    displayNameEn: extra.displayNameEn || name,
    displayNameIt: extra.displayNameIt || itAlias || name,
    aliases: [...new Set([...(aliases || []), name].filter(Boolean))],
    defaultUnit,
    unitGrams,
    gramsPerUnit: unitGrams,
    category: extra.category || department,
    department,
    caloriesPer100g: calories,
    proteinPer100g: protein,
    carbsPer100g: carbs,
    fatPer100g: fat,
    fiberPer100g: extra.fiberPer100g ?? null,
    sugarPer100g: extra.sugarPer100g ?? null,
    sodiumPer100g: extra.sodiumPer100g ?? null,
    source: extra.source || 'curated_seed',
    sourceProvider: extra.sourceProvider || 'curated_seed',
    sourceId: extra.sourceId || id,
    sourceUrl: extra.sourceUrl || '',
    confidence,
    rawOrCookedState: extra.rawOrCookedState || inferFoodState(name),
    importedAt: extra.importedAt || now,
    lastVerifiedAt: extra.lastVerifiedAt || now,
    lastUpdated: now,
    notes: extra.notes || source || 'Curated seed estimate. Values may vary by brand, cooking method, and raw/cooked state.',
    userEdited: false,
    minG,
    maxG,
    userId: extra.userId || null,
  };
}

function inferFoodState(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('dry') || n.includes('oats') || n.includes('rice') || n.includes('pasta') || n.includes('couscous') || n.includes('quinoa')) return 'dry_raw';
  if (n.includes('oil') || n.includes('butter') || n.includes('honey') || n.includes('jam')) return 'as_sold';
  if (n.includes('chicken') || n.includes('turkey') || n.includes('beef') || n.includes('salmon') || n.includes('cod') || n.includes('sea bass')) return 'raw_or_cooked_varies';
  return 'as_sold_or_raw';
}

function normalizeFoodRecord(food) {
  if (!food) return food;
  const base = { ...food };
  base.displayNameEn ||= base.name || '';
  base.displayNameIt ||= (base.aliases || []).find((a) => a !== base.name) || base.name || '';
  base.aliases = [...new Set([...(base.aliases || []), base.name, base.displayNameEn, base.displayNameIt].filter(Boolean))];
  base.gramsPerUnit ??= base.unitGrams ?? 100;
  base.unitGrams ??= base.gramsPerUnit ?? 100;
  base.category ||= base.department || 'Other';
  base.department ||= 'Other';
  base.sourceProvider ||= base.source === 'curated_seed' ? 'curated_seed' : (base.source || 'manual').toLowerCase().includes('open food facts') ? 'open_food_facts' : 'manual';
  base.sourceId ||= base.id;
  base.sourceUrl ||= '';
  base.confidence ||= 'unknown';
  base.rawOrCookedState ||= inferFoodState(base.name);
  base.importedAt ||= base.lastUpdated || new Date().toISOString();
  base.lastVerifiedAt ||= base.lastUpdated || new Date().toISOString();
  base.notes ||= 'Values may vary by brand and preparation method.';
  base.userEdited = Boolean(base.userEdited);
  base.minG ??= 0;
  base.maxG ??= 1000;
  return base;
}

function localizedFoodName(food) {
  if (!food) return '';
  return normalizeLanguage(state.settings?.language) === 'it' ? (food.displayNameIt || food.name) : (food.displayNameEn || food.name);
}

function recipe(id, slot, name, ingredients, steps, prepMinutes, cookMinutes, storageNotes) {
  return { id, slot, name, ingredients, steps, prepMinutes, cookMinutes, storageNotes };
}

function $(id) {
  return document.getElementById(id);
}

function html(strings, ...values) {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function uuid(prefix = 'id') {
  const cryptoId = crypto?.randomUUID?.();
  return cryptoId ? `${prefix}_${cryptoId}` : `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function roundToStep(value, step = 1) {
  return round(Math.round(value / step) * step, step < 1 ? 2 : 0);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

function todayISO() {
  const d = new Date();
  return dateToISO(d);
}

function dateToISO(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(iso, days) {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return dateToISO(d);
}

function startOfWeekISO(iso = todayISO()) {
  const d = parseISODate(iso);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return dateToISO(d);
}

function currentLocale() {
  return normalizeLanguage(state?.settings?.language || detectInitialLanguage()) === 'it' ? 'it-IT' : 'en-US';
}

function formatDate(iso, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return parseISODate(iso).toLocaleDateString(currentLocale(), options);
}

function isWeekend(iso) {
  const day = parseISODate(iso).getDay();
  return day === 0 || day === 6;
}

function eachDate(start, end, includeWeekends = true) {
  const out = [];
  for (let cur = start; cur <= end; cur = addDays(cur, 1)) {
    if (includeWeekends || !isWeekend(cur)) out.push(cur);
  }
  return out;
}

function emptyMacros() {
  return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 };
}

function addMacros(a, b) {
  return {
    calories: (a.calories || 0) + (b.calories || 0),
    protein: (a.protein || 0) + (b.protein || 0),
    carbs: (a.carbs || 0) + (b.carbs || 0),
    fat: (a.fat || 0) + (b.fat || 0),
    fiber: (a.fiber || 0) + (b.fiber || 0),
    sugar: (a.sugar || 0) + (b.sugar || 0),
    sodium: (a.sodium || 0) + (b.sodium || 0),
  };
}

function subtractMacros(a, b) {
  return {
    calories: (a.calories || 0) - (b.calories || 0),
    protein: (a.protein || 0) - (b.protein || 0),
    carbs: (a.carbs || 0) - (b.carbs || 0),
    fat: (a.fat || 0) - (b.fat || 0),
  };
}

function macroCaloriesFromGrams(macros) {
  return (Number(macros.protein) || 0) * 4 + (Number(macros.carbs) || 0) * 4 + (Number(macros.fat) || 0) * 9;
}

function macroDiffHtml(total, target) {
  const diff = subtractMacros(total, target);
  return html`
    <div class="macro-pills">
      ${macroPill('Cal', diff.calories, 'kcal')}
      ${macroPill('P', diff.protein, 'g')}
      ${macroPill('C', diff.carbs, 'g')}
      ${macroPill('F', diff.fat, 'g')}
    </div>`;
}

function macroPill(label, value, unit = '') {
  const num = round(value, unit === 'kcal' ? 0 : 1);
  const cls = Math.abs(num) < (unit === 'kcal' ? 50 : 5) ? 'good' : num > 0 ? 'warn' : 'blue';
  const signed = num > 0 ? `+${num}` : `${num}`;
  return `<span class="status-pill ${cls}">${label} ${signed}${unit}</span>`;
}

function totalsText(macros) {
  return `${round(macros.calories)} kcal · P ${round(macros.protein, 1)}g · C ${round(macros.carbs, 1)}g · F ${round(macros.fat, 1)}g`;
}

function getFoodById(id) {
  return state.foods.find((f) => f.id === id) || null;
}

function lookupFood(query) {
  const needle = normalizeText(query);
  if (!needle) return null;
  const exact = state.foods.find((food) => [food.name, ...(food.aliases || [])].some((alias) => normalizeText(alias) === needle));
  if (exact) return exact;
  return state.foods.find((food) => [food.name, ...(food.aliases || [])].some((alias) => {
    const norm = normalizeText(alias);
    return norm && (needle.includes(norm) || norm.includes(needle));
  })) || null;
}

function normalizeUnit(unit, qty = 1, food = null) {
  const u = normalizeText(unit || '');
  if (['g', 'gr', 'gram', 'grams', 'grammi'].includes(u)) return 'g';
  if (['kg', 'kilogram', 'kilograms', 'chilo', 'chili'].includes(u)) return 'kg';
  if (['ml', 'milliliter', 'milliliters'].includes(u)) return 'ml';
  if (['l', 'liter', 'liters', 'litro', 'litri'].includes(u)) return 'l';
  if (['piece', 'pieces', 'pcs', 'pc', 'pz', 'unit', 'units', 'u'].includes(u)) return 'piece';
  if (!u) {
    if (food?.defaultUnit === 'piece') return 'piece';
    return qty > 15 ? 'g' : 'piece';
  }
  return u;
}

function quantityToGrams(quantity, unit, food) {
  const qty = Number(quantity) || 0;
  if (unit === 'kg') return qty * 1000;
  if (unit === 'l') return qty * 1000;
  if (unit === 'ml') return qty;
  if (unit === 'piece') return qty * (Number(food?.unitGrams) || 100);
  return qty;
}

function displayQuantity(item) {
  const food = getFoodById(item.foodId);
  if (item.unit === 'piece') {
    const qty = Number(item.quantity) || (item.grams / (food?.unitGrams || 100));
    const label = Math.abs(qty - 1) < 0.01 ? 'piece' : 'pieces';
    return `${round(qty, qty % 1 ? 2 : 0)} ${label}`;
  }
  if (item.unit === 'ml') return `${round(item.quantity ?? item.grams)} ml`;
  if ((item.grams || 0) >= 1000) return `${round((item.grams || 0) / 1000, 2)} kg`;
  return `${round(item.grams || item.quantity || 0)} g`;
}

function setItemGrams(item, grams) {
  const food = getFoodById(item.foodId);
  const safe = Math.max(0, Number(grams) || 0);
  if (item.unit === 'piece') {
    const unitGrams = Number(food?.unitGrams) || 100;
    const pieces = roundToStep(safe / unitGrams, 0.25);
    item.quantity = pieces;
    item.grams = round(pieces * unitGrams, 1);
  } else if (item.unit === 'ml') {
    item.quantity = round(safe, safe < 20 ? 1 : 0);
    item.grams = item.quantity;
  } else {
    item.unit = 'g';
    item.quantity = round(safe, safe < 20 ? 1 : 0);
    item.grams = item.quantity;
  }
}

function calcItemMacros(item) {
  const food = getFoodById(item.foodId);
  if (!food) return emptyMacros();
  const factor = (Number(item.grams) || 0) / 100;
  return {
    calories: factor * (Number(food.caloriesPer100g) || 0),
    protein: factor * (Number(food.proteinPer100g) || 0),
    carbs: factor * (Number(food.carbsPer100g) || 0),
    fat: factor * (Number(food.fatPer100g) || 0),
    fiber: factor * (Number(food.fiberPer100g) || 0),
    sugar: factor * (Number(food.sugarPer100g) || 0),
    sodium: factor * (Number(food.sodiumPer100g) || 0),
  };
}

function calcMealMacros(meal) {
  return (meal.items || []).reduce((acc, item) => addMacros(acc, calcItemMacros(item)), emptyMacros());
}

function calcMealsMacros(meals) {
  return (meals || []).reduce((acc, meal) => addMacros(acc, calcMealMacros(meal)), emptyMacros());
}

function calcDayProjected(day) {
  return (day?.meals || [])
    .filter((m) => m.status !== 'skipped')
    .reduce((acc, meal) => addMacros(acc, calcMealMacros(meal)), emptyMacros());
}

function calcDayCompleted(day) {
  return (day?.meals || [])
    .filter((m) => m.status === 'completed')
    .reduce((acc, meal) => addMacros(acc, calcMealMacros(meal)), emptyMacros());
}

function calcDaySkipped(day) {
  return (day?.meals || [])
    .filter((m) => m.status === 'skipped')
    .reduce((acc, meal) => addMacros(acc, calcMealMacros(meal)), emptyMacros());
}

function getTargetForDay(dayOrDate) {
  const day = typeof dayOrDate === 'string' ? findPlan(dayOrDate) : dayOrDate;
  if (day?.workout?.isWorkout && state.target.workout?.enabled) {
    return { ...state.target, ...state.target.workout };
  }
  if (!day?.workout?.isWorkout && state.target.rest?.enabled) {
    return { ...state.target, ...state.target.rest };
  }
  return state.target;
}

function macroValidationMessage(target) {
  const macroCalories = macroCaloriesFromGrams(target);
  const diff = macroCalories - Number(target.calories || 0);
  const pct = target.calories ? Math.abs(diff) / target.calories : 0;
  if (pct <= 0.05) return `<div class="success-box small">Macro calories are close to target: ${round(macroCalories)} kcal from macros.</div>`;
  return `<div class="warning-box small">Macro calories are ${round(macroCalories)} kcal, which differs from the calorie target by ${round(diff)} kcal. This app saves the target but keeps the mismatch visible.</div>`;
}

function findPlan(date) {
  return state.plans.find((p) => p.date === date) || null;
}

function sortByDate(a, b) {
  return a.date.localeCompare(b.date);
}

async function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const store of STORES) {
        if (!db.objectStoreNames.contains(store)) {
          const keyPath = store === 'plans' ? 'date' : 'id';
          db.createObjectStore(store, { keyPath });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet(store, key) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(store, 'readonly');
    const req = tx.objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

function idbGetAll(store) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(store, value) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(value);
    req.onsuccess = () => resolve(value);
    req.onerror = () => reject(req.error);
  });
}

function idbDelete(store, key) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

function idbClear(store) {
  return new Promise((resolve, reject) => {
    const tx = state.db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

function activeScoped(record = {}) {
  return { ...record, userId: state.activeUserId || record.userId || null };
}

function normalizeSettingsRecord(settings) {
  const normalized = { ...DEFAULT_SETTINGS, ...(settings || {}), id: 'settings' };
  normalized.language = normalizeLanguage(normalized.language);
  if (!['light', 'dark', 'system'].includes(normalized.theme)) normalized.theme = 'system';
  delete normalized.usdaApiKey;
  delete normalized.usdaConnectionStatus;
  return normalized;
}

async function __legacy_seedIfNeeded_1_unused() {
  const existingSettings = await idbGet('settings', 'settings');
  const profiles = await idbGetAll('profiles');
  const freshInstall = !existingSettings && profiles.length === 0;

  if (!existingSettings) await idbPut('settings', normalizeSettingsRecord(DEFAULT_SETTINGS));
  if (!(await idbGet('macroTargets', 'default'))) await idbPut('macroTargets', { ...DEFAULT_TARGET });
  await ensureSeedFoods();
  state.foods = (await idbGetAll('foods')).map(normalizeFoodRecord);
  if (!(await idbGet('baseline', 'baseline'))) {
    const parsed = parseBaselineText(SAMPLE_BASELINE);
    await idbPut('baseline', { id: 'baseline', rawText: SAMPLE_BASELINE, meals: parsed, updatedAt: new Date().toISOString(), userId: null });
  }
  if (!freshInstall && profiles.length === 0) await migrateLegacyProfile();
}

async function ensureSeedFoods() {
  const existing = await idbGetAll('foods');
  const byId = new Map(existing.map((f) => [f.id, f]));
  for (const food of SEED_FOODS.map(normalizeFoodRecord)) {
    const current = byId.get(food.id);
    if (!current) {
      await idbPut('foods', food);
    } else if (!current.userEdited) {
      await idbPut('foods', { ...food, ...current, ...normalizeFoodRecord(current), aliases: [...new Set([...(food.aliases || []), ...(current.aliases || [])])] });
    }
  }
}

async function migrateLegacyProfile() {
  const now = new Date().toISOString();
  const settings = normalizeSettingsRecord(await idbGet('settings', 'settings'));
  const profile = {
    id: 'local-default',
    displayName: 'Local User',
    email: '',
    language: settings.language,
    theme: settings.theme,
    units: settings.units || 'metric',
    createdAt: now,
    updatedAt: now,
    hasPassword: false,
    passwordHash: '',
    passwordSalt: '',
    authMethod: 'none',
    lastLoginAt: now,
  };
  await idbPut('profiles', profile);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: profile.id, startedAt: now }));
  await attachLegacyData(profile.id);
}

async function attachLegacyData(userId) {
  for (const store of ['settings', 'macroTargets', 'baseline', 'plans', 'body', 'blood', 'dashboardPreferences']) {
    const records = await idbGetAll(store).catch(() => []);
    for (const record of records) {
      if (!record.userId) await idbPut(store, { ...record, userId });
    }
  }
}

function getActiveSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

async function __legacy_loadState_1_unused() {
  state.profiles = (await idbGetAll('profiles')).sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || '')));
  const session = getActiveSession();
  state.activeProfile = state.profiles.find((p) => p.id === session?.userId) || null;
  state.activeUserId = state.activeProfile?.id || null;
  state.needsOnboarding = !state.activeProfile;

  state.settings = normalizeSettingsRecord((await idbGet('settings', 'settings')) || DEFAULT_SETTINGS);
  if (state.activeProfile) {
    state.settings.language = normalizeLanguage(state.activeProfile.language || state.settings.language);
    state.settings.theme = state.activeProfile.theme || state.settings.theme || 'system';
    state.settings.units = state.activeProfile.units || state.settings.units || 'metric';
  }
  state.target = (await idbGet('macroTargets', 'default')) || DEFAULT_TARGET;
  state.foods = (await idbGetAll('foods')).map(normalizeFoodRecord).filter((f) => !f.userId || !state.activeUserId || f.userId === state.activeUserId).sort((a, b) => localizedFoodName(a).localeCompare(localizedFoodName(b)));
  state.baseline = (await idbGet('baseline', 'baseline')) || { id: 'baseline', rawText: SAMPLE_BASELINE, meals: parseBaselineText(SAMPLE_BASELINE), userId: state.activeUserId };
  state.plans = (await idbGetAll('plans')).filter((p) => !p.userId || !state.activeUserId || p.userId === state.activeUserId).sort(sortByDate);
  state.bodyEntries = (await idbGetAll('body')).filter((p) => !p.userId || !state.activeUserId || p.userId === state.activeUserId).sort(sortByDate);
  state.bloodExams = (await idbGetAll('blood')).filter((p) => !p.userId || !state.activeUserId || p.userId === state.activeUserId).sort(sortByDate);
  applyLanguageAndTheme();
}

async function saveSettings(settings) {
  state.settings = normalizeSettingsRecord({ ...state.settings, ...settings, id: 'settings', userId: state.activeUserId });
  localStorage.setItem('dietPlanner.language', state.settings.language);
  localStorage.setItem('dietPlanner.theme', state.settings.theme);
  await idbPut('settings', state.settings);
  if (state.activeProfile) {
    state.activeProfile = { ...state.activeProfile, language: state.settings.language, theme: state.settings.theme, units: state.settings.units, updatedAt: new Date().toISOString() };
    await idbPut('profiles', state.activeProfile);
  }
  applyLanguageAndTheme();
}

async function saveTarget(target) {
  state.target = { ...target, id: 'default', userId: state.activeUserId, updatedAt: new Date().toISOString() };
  await idbPut('macroTargets', state.target);
}

function applyLanguageAndTheme() {
  const lang = normalizeLanguage(state.settings?.language || detectInitialLanguage());
  document.documentElement.lang = lang;
  const preference = state.settings?.theme || localStorage.getItem('dietPlanner.theme') || 'system';
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0f172a' : '#f7f8fb');
}

async function hashPassword(password, salt = cryptoRandomSalt()) {
  const input = `${salt}:${password}`;
  if (globalThis.crypto?.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
    return { salt, hash: [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('') };
  }
  return { salt, hash: btoa(unescape(encodeURIComponent(input))) };
}

function cryptoRandomSalt() {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createLocalProfileFromForm() {
  const displayName = $('profileDisplayName')?.value.trim();
  if (!displayName) { toast('Display name is required.'); return; }
  const email = $('profileEmail')?.value.trim() || '';
  const language = $('profileLanguage')?.value || detectInitialLanguage();
  const theme = $('profileTheme')?.value || 'system';
  const units = $('profileUnits')?.value || 'metric';
  const password = $('profilePassword')?.value || '';
  const now = new Date().toISOString();
  let passwordHash = '';
  let passwordSalt = '';
  if (password) {
    const hashed = await hashPassword(password);
    passwordHash = hashed.hash;
    passwordSalt = hashed.salt;
  }
  const profile = {
    id: uuid('user'), displayName, email, language, theme, units, createdAt: now, updatedAt: now,
    hasPassword: Boolean(password), passwordHash, passwordSalt, authMethod: password ? 'local_password_hash' : 'none', lastLoginAt: now,
  };
  await idbPut('profiles', profile);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: profile.id, startedAt: now }));
  await attachLegacyData(profile.id);
  await saveSettings({ language, theme, units });
  await loadState();
  if (state.activeProfile) await ensureStarterPlan();
  renderNav();
  render();
  toast('Local profile created.');
}

async function loginProfile(profileId) {
  const profile = state.profiles.find((p) => p.id === profileId);
  if (!profile) return;
  if (profile.hasPassword) {
    const password = $('loginPassword')?.value || '';
    const hashed = await hashPassword(password, profile.passwordSalt);
    if (hashed.hash !== profile.passwordHash) { toast('Incorrect password.'); return; }
  }
  profile.lastLoginAt = new Date().toISOString();
  await idbPut('profiles', profile);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: profile.id, startedAt: new Date().toISOString() }));
  await loadState();
  if (state.activeProfile) await ensureStarterPlan();
  renderNav();
  render();
}

async function logoutProfile() {
  if (getCloudSession()) {
    try { await apiRequest('/api/auth/logout', { method: 'POST', body: {} }); } catch {}
  }
  localStorage.removeItem(CLOUD_SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  await loadState();
  renderNav();
  render();
}


function parseBaselineText(raw) {
  const lines = String(raw || '').split(/\r?\n/);
  const meals = [];
  let current = null;
  let snackCount = 0;

  const pushMeal = (name) => {
    current = { id: uuid('template'), slot: name, items: [], notes: '' };
    meals.push(current);
  };

  for (const originalLine of lines) {
    const line = originalLine.trim();
    if (!line) continue;
    const cleaned = line.replace(/^[-*•\s]+/, '').trim();
    const header = parseMealHeader(cleaned);
    if (header) {
      let slot = header;
      if (slot === 'Snack') {
        snackCount += 1;
        slot = snackCount === 1 ? 'Snack 1' : 'Snack 2';
      }
      pushMeal(slot);
      continue;
    }
    if (!current) pushMeal('Breakfast');
    current.items.push(parseFoodLine(cleaned));
  }

  const bySlot = new Map(meals.map((m) => [m.slot, m]));
  return MEAL_SLOTS.map((slot) => bySlot.get(slot.slot) || { id: uuid('template'), slot: slot.slot, items: [], notes: '' });
}

function parseMealHeader(line) {
  const clean = normalizeText(line.replace(/:$/, ''));
  if (!line.endsWith(':') && !['breakfast', 'colazione', 'snack', 'spuntino', 'lunch', 'pranzo', 'dinner', 'cena'].includes(clean)) return null;
  if (clean.includes('breakfast') || clean.includes('colazione')) return 'Breakfast';
  if (clean.includes('lunch') || clean.includes('pranzo')) return 'Lunch';
  if (clean.includes('dinner') || clean.includes('cena')) return 'Dinner';
  if (clean.includes('snack') || clean.includes('spuntino')) return 'Snack';
  return null;
}

function parseFoodLine(line) {
  let sourceText = line.trim();
  let notes = '';
  const noteMatch = sourceText.match(/\(([^)]+)\)/);
  if (noteMatch) {
    notes = noteMatch[1].trim();
    sourceText = sourceText.replace(noteMatch[0], '').trim();
  }

  const unitPattern = '(kg|g|gr|grammi|grams|ml|l|pz|pcs|pieces|piece|unit|units|u)?';
  let name = sourceText;
  let quantity = 1;
  let unit = '';

  const trailing = sourceText.match(new RegExp(`^(.+?)\\s+(\\d+(?:[.,]\\d+)?)\\s*${unitPattern}$`, 'i'));
  const leading = sourceText.match(new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*${unitPattern}\\s+(.+)$`, 'i'));

  if (trailing) {
    name = trailing[1].trim();
    quantity = Number(trailing[2].replace(',', '.'));
    unit = trailing[3] || '';
  } else if (leading) {
    quantity = Number(leading[1].replace(',', '.'));
    unit = leading[2] || '';
    name = leading[3].trim();
  }

  const food = lookupFood(name);
  const normalizedUnit = normalizeUnit(unit, quantity, food);
  const grams = quantityToGrams(quantity, normalizedUnit, food);
  const item = {
    id: uuid('item'),
    foodId: food?.id || null,
    foodName: food?.name || name,
    rawName: name,
    quantity,
    unit: normalizedUnit === 'kg' ? 'g' : normalizedUnit === 'l' ? 'ml' : normalizedUnit,
    grams,
    originalGrams: grams,
    locked: false,
    notes,
    source: food?.source || 'Manual value required',
    confidence: food?.confidence || 'unknown',
  };
  if (normalizedUnit === 'kg' || normalizedUnit === 'l') item.quantity = grams;
  return item;
}

function createItemFromFood(foodId, quantity, unit) {
  const food = getFoodById(foodId);
  const normalizedUnit = normalizeUnit(unit, quantity, food);
  const grams = quantityToGrams(quantity, normalizedUnit, food);
  return {
    id: uuid('item'),
    foodId: food?.id || foodId,
    foodName: food?.name || foodId,
    rawName: food?.name || foodId,
    quantity,
    unit: normalizedUnit === 'kg' ? 'g' : normalizedUnit === 'l' ? 'ml' : normalizedUnit,
    grams,
    originalGrams: grams,
    locked: false,
    notes: '',
    source: food?.source || 'Manual value required',
    confidence: food?.confidence || 'unknown',
  };
}

function createMealFromTemplate(template, date) {
  const slotMeta = MEAL_SLOTS.find((m) => m.slot === template.slot) || { time: '12:00' };
  const items = deepClone(template.items || []).map((item) => ({
    ...item,
    id: uuid('item'),
    originalGrams: item.grams,
    locked: Boolean(item.locked),
  }));
  const meal = {
    id: uuid('meal'),
    date,
    slot: template.slot,
    time: state.settings.mealTimes?.[template.slot] || slotMeta.time,
    status: 'planned',
    locked: false,
    recipeName: `${template.slot} baseline`,
    instructions: [],
    storageNotes: '',
    originalItems: deepClone(items),
    items,
    notes: template.notes || '',
    source: 'baseline',
    adjustments: [],
  };
  meal.originalMacros = calcMealMacros(meal);
  return meal;
}

function __legacy_createMealFromRecipe_1_unused(recipeObj, date) {
  const items = recipeObj.ingredients.map(([foodId, quantity, unit]) => createItemFromFood(foodId, quantity, unit));
  const meal = {
    id: uuid('meal'),
    date,
    slot: recipeObj.slot,
    time: state.settings.mealTimes?.[recipeObj.slot] || MEAL_SLOTS.find((m) => m.slot === recipeObj.slot)?.time || '12:00',
    status: 'planned',
    locked: false,
    recipeName: recipeObj.name,
    instructions: recipeObj.steps,
    prepMinutes: recipeObj.prepMinutes,
    cookMinutes: recipeObj.cookMinutes,
    storageNotes: recipeObj.storageNotes,
    originalItems: deepClone(items),
    items,
    notes: '',
    source: 'recipe_library',
    adjustments: [],
  };
  meal.originalMacros = calcMealMacros(meal);
  return meal;
}

function getItemBounds(item) {
  const food = getFoodById(item.foodId);
  const original = Number(item.originalGrams || item.grams || 0);
  const hasFoodMin = food && food.minG != null;
  const hasFoodMax = food && food.maxG != null;
  const dynamicMin = original ? original * 0.5 : 0;
  const dynamicMax = Math.max(original * 2.5, original + 200, 100);
  const min = item.locked ? item.grams : (hasFoodMin ? Number(food.minG) : dynamicMin);
  const max = item.locked ? item.grams : (hasFoodMax ? Number(food.maxG) : dynamicMax);
  return { min: Math.max(0, min), max: Math.max(0, max, min) };
}

function roleScore(food, macro) {
  if (!food) return 0;
  if (macro === 'protein') return Number(food.proteinPer100g) || 0;
  if (macro === 'carbs') return Number(food.carbsPer100g) || 0;
  if (macro === 'fat') return Number(food.fatPer100g) || 0;
  return 0;
}

function perGram(food, macro) {
  if (!food) return 0;
  if (macro === 'protein') return (Number(food.proteinPer100g) || 0) / 100;
  if (macro === 'carbs') return (Number(food.carbsPer100g) || 0) / 100;
  if (macro === 'fat') return (Number(food.fatPer100g) || 0) / 100;
  if (macro === 'calories') return (Number(food.caloriesPer100g) || 0) / 100;
  return 0;
}

function flattenMealItems(meals) {
  return meals.flatMap((meal) => (meal.items || []).map((item) => ({ meal, item, food: getFoodById(item.foodId) })));
}

function scaleMealsToTarget(meals, target, options = {}) {
  const warnings = [];
  const tolerance = options.tolerance || state.target.tolerance || { caloriesPct: 5, protein: 5, carbs: 10, fat: 5 };
  let candidates = flattenMealItems(meals).filter((x) => x.food && !x.item.locked && !x.meal.locked);
  let current = calcMealsMacros(meals);
  if (current.calories <= 0 || candidates.length === 0) {
    warnings.push('Not enough known nutrition data to optimize this plan. Add or correct food nutrition values.');
    return { totals: current, warnings };
  }

  const targetCalories = Number(target.calories) || current.calories;
  const globalFactor = clamp(targetCalories / Math.max(1, current.calories), 0.5, 2.0);
  for (const { item } of candidates) {
    const bounds = getItemBounds(item);
    setItemGrams(item, clamp((item.grams || 0) * globalFactor, bounds.min, bounds.max));
  }

  const refine = (passes = 8) => {
    const macroOrder = ['protein', 'carbs', 'fat'];
    for (let pass = 0; pass < passes; pass += 1) {
      for (const macro of macroOrder) {
        current = calcMealsMacros(meals);
        const gap = (target[macro] || 0) - (current[macro] || 0);
        const tol = tolerance[macro] ?? 4;
        if (Math.abs(gap) <= tol) continue;
        const sorted = [...candidates]
          .filter(({ food }) => perGram(food, macro) > 0.005)
          .sort((a, b) => macroAdjusterScore(b.food, macro) - macroAdjusterScore(a.food, macro));
        let remainingGap = gap;
        for (const { item, food } of sorted) {
          const nutrientPerGram = perGram(food, macro);
          if (nutrientPerGram <= 0) continue;
          const bounds = getItemBounds(item);
          if (remainingGap > 0) {
            const available = bounds.max - (item.grams || 0);
            if (available <= 0) continue;
            const add = clamp(remainingGap / nutrientPerGram, 0, available);
            setItemGrams(item, (item.grams || 0) + add);
            remainingGap -= add * nutrientPerGram;
          } else {
            const available = (item.grams || 0) - bounds.min;
            if (available <= 0) continue;
            const reduce = clamp(Math.abs(remainingGap) / nutrientPerGram, 0, available);
            setItemGrams(item, (item.grams || 0) - reduce);
            remainingGap += reduce * nutrientPerGram;
          }
          if (Math.abs(remainingGap) <= tol) break;
        }
      }
    }
  };

  refine(8);
  current = calcMealsMacros(meals);
  const added = addMacroAdjusters(meals, target, tolerance);
  if (added.length) {
    candidates = flattenMealItems(meals).filter((x) => x.food && !x.item.locked && !x.meal.locked);
    refine(6);
  }

  current = calcMealsMacros(meals);
  const calorieTolerance = (target.calories || 0) * ((tolerance.caloriesPct || 5) / 100);
  const misses = [];
  if (Math.abs((current.calories || 0) - (target.calories || 0)) > calorieTolerance) misses.push(`calories ${round(current.calories - target.calories)} kcal`);
  for (const macro of ['protein', 'carbs', 'fat']) {
    if (Math.abs((current[macro] || 0) - (target[macro] || 0)) > (tolerance[macro] || 5)) {
      misses.push(`${macro} ${round(current[macro] - target[macro], 1)}g`);
    }
  }
  if (added.length) warnings.push(`Added macro adjusters: ${added.join(', ')}.`);
  if (misses.length) {
    const blocking = explainOptimizationBlocks(meals, target, current, tolerance);
    warnings.push(`Closest practical adjustment still differs from target: ${misses.join(', ')}. ${blocking}`);
  }
  return { totals: current, warnings };
}

function macroAdjusterScore(food, macro) {
  const target = roleScore(food, macro);
  const calories = perGram(food, 'calories') || 0.01;
  const competing = ['protein', 'carbs', 'fat'].filter((m) => m !== macro).reduce((sum, m) => sum + roleScore(food, m), 0);
  return target * 2 + target / calories - competing * 0.2;
}

function addMacroAdjusters(meals, target, tolerance) {
  const added = [];
  const roles = [
    { macro: 'protein', foods: ['whey_protein', 'egg_whites', 'skyr', 'greek_yogurt_0', 'chicken_breast', 'tuna_natural'], mealSlots: ['Snack 1', 'Snack 2', 'Lunch', 'Dinner'] },
    { macro: 'carbs', foods: ['rice_dry', 'basmati_rice_dry', 'pasta_dry', 'oats', 'potatoes', 'rice_cakes', 'banana'], mealSlots: ['Breakfast', 'Lunch', 'Snack 2', 'Dinner'] },
    { macro: 'fat', foods: ['olive_oil', 'almonds', 'walnuts', 'avocado', 'peanut_butter'], mealSlots: ['Lunch', 'Dinner', 'Snack 1'] },
  ];
  for (const role of roles) {
    let current = calcMealsMacros(meals);
    const gap = (target[role.macro] || 0) - (current[role.macro] || 0);
    if (gap <= (tolerance[role.macro] || 5)) continue;
    const food = role.foods.map(getFoodById).filter(Boolean).sort((a, b) => macroAdjusterScore(b, role.macro) - macroAdjusterScore(a, role.macro))[0];
    if (!food) continue;
    const per = perGram(food, role.macro);
    if (per <= 0) continue;
    const bounds = { min: food.minG ?? 0, max: food.maxG ?? 1000 };
    const grams = clamp(gap / per, Math.max(bounds.min, role.macro === 'fat' ? 3 : 20), bounds.max);
    if (grams <= 0) continue;
    const meal = role.mealSlots.map((slot) => meals.find((m) => m.slot === slot && m.status !== 'skipped' && !m.locked)).find(Boolean) || meals.find((m) => m.status !== 'skipped' && !m.locked);
    if (!meal) continue;
    const item = createItemFromFood(food.id, grams, 'g');
    item.source = 'macro_adjuster';
    item.notes = `Added automatically to close ${role.macro} gap.`;
    item.originalGrams = 0;
    meal.items.push(item);
    meal.adjustments ||= [];
    meal.adjustments.push({ at: new Date().toISOString(), type: 'macro_adjuster_added', foodId: food.id, foodName: food.name, grams, macro: role.macro });
    added.push(`${localizedFoodName(food)} ${round(grams)}g for ${role.macro}`);
  }
  return added;
}

function explainOptimizationBlocks(meals, target, current, tolerance) {
  const blockers = [];
  for (const macro of ['protein', 'carbs', 'fat']) {
    const gap = (target[macro] || 0) - (current[macro] || 0);
    if (Math.abs(gap) <= (tolerance[macro] || 5)) continue;
    const candidates = flattenMealItems(meals).filter(({ food, item, meal }) => food && !item.locked && !meal.locked && perGram(food, macro) > 0.005);
    if (gap > 0 && candidates.every(({ item }) => (item.grams || 0) >= getItemBounds(item).max - 0.1)) blockers.push(`${macro} is still below target because usable ${macro} foods are at max portion limits`);
    if (gap < 0 && candidates.every(({ item }) => (item.grams || 0) <= getItemBounds(item).min + 0.1)) blockers.push(`${macro} is still above target because usable ${macro} foods are at min portion limits`);
  }
  return blockers.length ? blockers.join('; ') + '. Add another food or change portion limits.' : 'Adjust portion limits or add a food that targets the missing macro.';
}

function scaleDayToTarget(day, target) {
  const result = scaleMealsToTarget(day.meals, target);
  day.targetSnapshot = compactTarget(target);
  day.generatedTotals = calcDayProjected(day);
  day.generationWarnings = result.warnings;
  day.updatedAt = new Date().toISOString();
  return day;
}

function compactTarget(target) {
  return {
    calories: Number(target.calories) || 0,
    protein: Number(target.protein) || 0,
    carbs: Number(target.carbs) || 0,
    fat: Number(target.fat) || 0,
    tolerance: deepClone(target.tolerance || {}),
  };
}

function __legacy_makeDayPlan_1_unused(date, lunchOverride = null) {
  const templates = state.baseline?.meals?.length ? state.baseline.meals : parseBaselineText(SAMPLE_BASELINE);
  const meals = MEAL_SLOTS.map(({ slot }) => {
    if (slot === 'Lunch' && lunchOverride) return createMealFromRecipe(lunchOverride, date);
    const template = templates.find((m) => m.slot === slot) || { slot, items: [] };
    return createMealFromTemplate(template, date);
  });
  return {
    date,
    userId: state.activeUserId,
    dayName: formatDate(date, { weekday: 'long' }),
    meals,
    workout: { isWorkout: false, time: '18:30', type: 'Strength', modifiedMealId: null, reason: '' },
    notes: '',
    generatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    recalculationLog: [],
  };
}

async function __legacy_generatePlans_1_unused(start, end, includeWeekends, lunchMode = state.settings.lunchMode) {
  const dates = eachDate(start, end, includeWeekends);
  const lunchRecipes = RECIPE_LIBRARY.filter((r) => r.slot === 'Lunch');
  const created = [];
  for (let i = 0; i < dates.length; i += 1) {
    let lunchOverride = null;
    if (lunchMode === 'rotating') {
      const pattern = [0, 0, 1, 1, 2];
      lunchOverride = lunchRecipes[pattern[i % pattern.length] % lunchRecipes.length];
    }
    const day = makeDayPlan(dates[i], lunchOverride);
    scaleDayToTarget(day, getTargetForDay(day));
    await idbPut('plans', day);
    created.push(day);
  }
  await loadState();
  toast(`Generated ${created.length} day plan${created.length === 1 ? '' : 's'}.`);
  render();
}

async function ensureStarterPlan() {
  if (findPlan(todayISO())) return;
  const monday = startOfWeekISO(todayISO());
  await generatePlans(monday, addDays(monday, 4), false, state.settings.lunchMode);
}

async function __legacy_init_1_unused() {
  state.db = await openDb();
  await seedIfNeeded();
  await refreshCloudUser();
  await loadState();
  if (state.activeProfile) await ensureStarterPlan();
  renderNav();
  render();
  setupEvents();
  registerServiceWorker();
}

function renderNav() {
  const desktop = $('desktopNav');
  const mobile = $('mobileNav');
  if ($('brandSubtitle')) $('brandSubtitle').textContent = tr('app.privateMvp');
  desktop.innerHTML = DESKTOP_NAV.map(([view, icon, key]) => navButton(view, icon, tr(key))).join('');
  mobile.innerHTML = MOBILE_NAV.map(([view, icon, key]) => navButton(view, icon, tr(key))).join('');
}

function navButton(view, icon, label) {
  const active = state.view === view ? 'active' : '';
  return `<button class="nav-button ${active}" data-action="nav" data-view="${view}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`;
}

function setView(view) {
  state.view = view;
  localStorage.setItem('dietPlanner.view', view);
  renderNav();
  render();
}

function render() {
  applyLanguageAndTheme();
  const titles = {
    today: tr('page.today'), week: tr('page.week'), grocery: tr('page.grocery'), prep: tr('page.prep'),
    progress: tr('page.progress'), recipes: tr('page.recipes'), body: tr('page.body'), blood: tr('page.blood'), settings: tr('page.settings'),
  };
  $('pageTitle').textContent = state.needsOnboarding ? tr('profile.createTitle') : (titles[state.view] || 'Diet Planner');
  const app = $('app');
  if (state.needsOnboarding) {
    app.innerHTML = renderProfileGate();
    return;
  }
  const renderer = {
    today: renderToday,
    week: renderWeek,
    grocery: renderGrocery,
    prep: renderPrep,
    progress: renderProgress,
    recipes: renderRecipes,
    body: renderBody,
    blood: renderBlood,
    settings: renderSettings,
  }[state.view] || renderToday;
  app.innerHTML = renderer();
}

function renderProfileGate() {
  const lang = detectInitialLanguage();
  const existing = state.profiles || [];
  return html`
    <div class="auth-shell">
      <section class="card stack auth-card">
        <div>
          <p class="eyebrow">Diet Planner</p>
          <h2>${tr('auth.cloudTitle')}</h2>
          <p class="muted small">${tr('auth.cloudHelp')}</p>
        </div>
        <div class="grid two">
          <label class="field"><span>${tr('auth.cloudEmail')}</span><input id="cloudLoginEmail" type="email" autocomplete="email" placeholder="name@example.com"></label>
          <label class="field"><span>${tr('auth.cloudPassword')}</span><input id="cloudLoginPassword" type="password" autocomplete="current-password"></label>
        </div>
        <button class="primary-button" data-action="cloud-login">${tr('auth.cloudLogin')}</button>
        <div id="cloudLoginStatus" class="small muted"></div>
      </section>

      <section class="card stack auth-card">
        <div>
          <h2>${tr('auth.offlineDemo')}</h2>
          <p class="muted small">${tr('settings.localProfileNote')}</p>
        </div>
        ${existing.filter((p) => p.authMethod !== 'diet_planner_cloud').length ? `<div class="stack-sm"><h3>${tr('profile.unlock')}</h3>${existing.filter((p) => p.authMethod !== 'diet_planner_cloud').map((p) => `
          <div class="card flat stack-sm">
            <strong>${escapeHtml(p.displayName)}</strong>
            <div class="small muted">${escapeHtml(p.email || 'Local profile')}</div>
            ${p.hasPassword ? `<label class="field"><span>${tr('profile.pin')}</span><input id="loginPassword" type="password" autocomplete="current-password"></label>` : ''}
            <button class="secondary-button" data-action="login-profile" data-profile-id="${p.id}">${tr('profile.unlock')}</button>
          </div>`).join('')}</div>` : ''}
        <div class="grid two">
          <label class="field"><span>${tr('profile.displayName')}</span><input id="profileDisplayName" autocomplete="name" placeholder="Mario"></label>
          <label class="field"><span>${tr('profile.email')}</span><input id="profileEmail" type="email" autocomplete="email"></label>
          <label class="field"><span>${tr('settings.language')}</span><select id="profileLanguage"><option value="en" ${lang === 'en' ? 'selected' : ''}>English</option><option value="it" ${lang === 'it' ? 'selected' : ''}>Italiano</option></select></label>
          <label class="field"><span>${tr('settings.theme')}</span><select id="profileTheme"><option value="system">${tr('settings.themeSystem')}</option><option value="light">${tr('settings.themeLight')}</option><option value="dark">${tr('settings.themeDark')}</option></select></label>
          <label class="field"><span>Unit system</span><select id="profileUnits"><option value="metric">Metric: g/ml/pieces</option></select></label>
          <label class="field"><span>${tr('profile.pin')}</span><input id="profilePassword" type="password" autocomplete="new-password" placeholder="${tr('profile.continueWithoutPassword')}"></label>
        </div>
        <button class="ghost-button" data-action="create-profile">${tr('profile.create')}</button>
      </section>
    </div>`;
}

async function cloudLoginFromForm() {
  const email = $('cloudLoginEmail')?.value.trim();
  const password = $('cloudLoginPassword')?.value || '';
  const status = $('cloudLoginStatus');
  if (!email || !password) { if (status) status.textContent = 'Email and password are required.'; return; }
  if (status) status.textContent = `${tr('common.loading')}...`;
  try {
    const payload = await apiRequest('/api/auth/login', { method: 'POST', body: { email, password } });
    if (!payload?.user) throw new Error('No user returned by backend.');
    const profile = normalizeCloudProfile(payload.user);
    await idbPut('profiles', profile);
    localStorage.setItem(CLOUD_SESSION_KEY, JSON.stringify({ user: payload.user, token: payload.token || '', startedAt: new Date().toISOString() }));
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: profile.id, startedAt: new Date().toISOString(), mode: 'cloud' }));
    await attachLegacyData(profile.id);
    await loadState();
    await loadCloudRecipesIfAvailable();
    await loadState();
    if (state.activeProfile) await ensureStarterPlan();
    renderNav();
    render();
    toast(tr('auth.cloudConnected'));
  } catch (error) {
    if (status) status.textContent = `${tr('auth.cloudUnavailable')} ${error.message}`;
  }
}

function macroStatus(target, projected) {
  const missing = projected.calories <= 0 || flattenMealItems(findPlan(todayISO())?.meals || []).some(({ item }) => !item.foodId || item.confidence === 'unknown');
  if (missing) return { label: tr('macro.needsData'), cls: 'warn' };
  const tolerance = target.tolerance || { caloriesPct: 5, protein: 5, carbs: 10, fat: 5 };
  const kcalOk = Math.abs(projected.calories - target.calories) <= (target.calories || 1) * ((tolerance.caloriesPct || 5) / 100);
  const pOk = Math.abs(projected.protein - target.protein) <= (tolerance.protein || 5);
  const cOk = Math.abs(projected.carbs - target.carbs) <= (tolerance.carbs || 10);
  const fOk = Math.abs(projected.fat - target.fat) <= (tolerance.fat || 5);
  return kcalOk && pOk && cOk && fOk ? { label: tr('macro.onTarget'), cls: 'good' } : { label: tr('macro.slightlyOff'), cls: 'blue' };
}

function targetSummaryCards(target, completed, projected) {
  const rows = [
    [tr('macro.calories'), completed.calories, projected.calories, target.calories, 'kcal'],
    [tr('macro.protein'), completed.protein, projected.protein, target.protein, 'g'],
    [tr('macro.carbs'), completed.carbs, projected.carbs, target.carbs, 'g'],
    [tr('macro.fat'), completed.fat, projected.fat, target.fat, 'g'],
  ];
  return `<div class="metric-grid compact">${rows.map(([label, done, planned, goal, unit]) => html`
    <div class="metric">
      <span>${label}</span>
      <strong>${round(done, unit === 'kcal' ? 0 : 1)} / ${round(goal, unit === 'kcal' ? 0 : 1)} ${unit}</strong>
      <div class="small muted">${tr('macro.projected')}: ${round(planned, unit === 'kcal' ? 0 : 1)} ${unit}</div>
    </div>`).join('')}</div>`;
}

function progressRows(target, completed, projected, day, includeProjected = false) {
  const totalMeals = (day.meals || []).length;
  const completedMeals = (day.meals || []).filter((m) => m.status === 'completed').length;
  const rows = [
    ['Meal completion', completedMeals, totalMeals || 1, `${completedMeals}/${totalMeals}`, 'good'],
    [tr('macro.calories') + ' consumed', completed.calories, target.calories || 1, `${round(completed.calories)} / ${round(target.calories)} kcal`, ''],
    [tr('macro.protein') + ' consumed', completed.protein, target.protein || 1, `${round(completed.protein, 1)} / ${round(target.protein, 1)} g`, ''],
    [tr('macro.carbs') + ' consumed', completed.carbs, target.carbs || 1, `${round(completed.carbs, 1)} / ${round(target.carbs, 1)} g`, ''],
    [tr('macro.fat') + ' consumed', completed.fat, target.fat || 1, `${round(completed.fat, 1)} / ${round(target.fat, 1)} g`, ''],
  ];
  if (includeProjected) {
    rows.splice(2, 0,
      [tr('macro.calories') + ' projected', projected.calories, target.calories || 1, `${round(projected.calories)} / ${round(target.calories)} kcal`, 'warn'],
      [tr('macro.protein') + ' projected', projected.protein, target.protein || 1, `${round(projected.protein, 1)} / ${round(target.protein, 1)} g`, 'warn'],
      [tr('macro.carbs') + ' projected', projected.carbs, target.carbs || 1, `${round(projected.carbs, 1)} / ${round(target.carbs, 1)} g`, 'warn'],
      [tr('macro.fat') + ' projected', projected.fat, target.fat || 1, `${round(projected.fat, 1)} / ${round(target.fat, 1)} g`, 'warn'],
    );
  }
  return `<div class="progress-list">${rows.map(([label, value, goal, text, cls]) => {
    const width = clamp((value / goal) * 100, 0, 135);
    return `<div class="progress-row"><div class="progress-meta"><span>${escapeHtml(label)}</span><span>${escapeHtml(text)}</span></div><div class="bar ${cls}" title="${escapeHtml(text)}"><i style="--value:${width}%"></i></div></div>`;
  }).join('')}</div>`;
}

function dashboardCard(action, title, body, badge = '', extraClass = '') {
  return `<button class="dashboard-card ${extraClass}" data-action="${action}" type="button">
    <span class="dashboard-card-main"><span class="dashboard-card-title">${title}</span><span class="dashboard-card-body">${body}</span></span>
    <span class="dashboard-card-side">${badge}<span class="chevron">›</span></span>
  </button>`;
}

function renderToday() {
  const date = todayISO();
  const day = findPlan(date);
  if (!day) {
    const monday = startOfWeekISO(date);
    return html`
      <div class="card stack">
        <h2>${tr('dashboard.noPlan')}</h2>
        <p class="muted">Generate a Monday–Friday plan from your baseline diet and macro target.</p>
        <button class="primary-button" data-action="generate-week" data-start="${monday}" data-end="${addDays(monday, 4)}" data-weekends="false">${tr('dashboard.generateWeek')}</button>
      </div>`;
  }
  const target = getTargetForDay(day);
  const completed = calcDayCompleted(day);
  const projected = calcDayProjected(day);
  const skipped = calcDaySkipped(day);
  const warnings = [...(day.generationWarnings || []), ...(day.recalculationLog?.slice(-1)[0]?.warnings || [])];
  const status = macroStatus(target, projected);
  const totalMeals = day.meals.length;
  const completedMeals = day.meals.filter((m) => m.status === 'completed').length;
  const overallPct = totalMeals ? Math.round((completedMeals / totalMeals) * 100) : 0;
  const grocery = buildGroceryList(date, date);
  const prepList = buildGroceryList(startOfWeekISO(date), addDays(startOfWeekISO(date), 4));
  return html`
    <div class="grid dashboard">
      <section class="stack compact-dashboard-stack">
        <p class="eyebrow">${formatDate(date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        ${dashboardCard('open-macro-detail', tr('macro.dailyTarget'), `${round(completed.calories)} / ${round(target.calories)} kcal · P ${round(completed.protein, 1)}/${round(target.protein, 1)}g · C ${round(completed.carbs, 1)}/${round(target.carbs, 1)}g · F ${round(completed.fat, 1)}/${round(target.fat, 1)}g<br><span class="muted">${tr('macro.projected')}: ${totalsText(projected)}</span>`, `<span class="status-pill ${status.cls}">${status.label}</span>`)}
        ${dashboardCard('open-progress-detail', tr('progress.title'), `${tr('progress.overall')}: <span class="inline-bar"><i style="--value:${overallPct}%"></i></span> ${overallPct}%<br><span class="muted">${tr('progress.completedMeals', { completed: completedMeals, total: totalMeals })} · ${round(completed.calories)} / ${round(target.calories)} kcal</span>`, '')}
        ${dashboardCard('open-workout-detail', tr('dashboard.workoutSummary'), `${day.workout?.isWorkout ? tr('dashboard.workoutDay') : tr('dashboard.restDay')} · ${escapeHtml(day.workout?.time || '18:30')} · ${escapeHtml(day.workout?.type || 'Strength')}`, '')}
        ${dashboardCard('open-prep-detail', tr('dashboard.mealPrepSummary'), `${prepList.items.length} ingredients across the current work week`, '')}
        ${dashboardCard('open-grocery-detail', tr('dashboard.grocerySummary'), `${grocery.items.length} grocery lines for today`, '')}
        ${warnings.length ? `<div class="warning-box small">${warnings.map(escapeHtml).join('<br>')}</div>` : ''}
        <div class="card tight stack-sm transparency-card">
          <h3>Transparency</h3>
          <div class="small muted">Macro calories formula: protein × 4 + carbs × 4 + fat × 9.</div>
          <div class="small muted">Skipped macros removed: ${totalsText(skipped)}.</div>
        </div>
      </section>

      <section class="card stack meal-checklist-card">
        <div class="card-title-row compact">
          <div>
            <h2>${tr('dashboard.mealChecklist')}</h2>
            <p class="muted small">Tap the circle to complete a meal. Skipping can recalculate remaining meals.</p>
          </div>
        </div>
        ${day.meals.map((meal) => renderMealCard(day, meal)).join('')}
      </section>
    </div>`;
}

function renderMacroDetail(day) {
  const target = getTargetForDay(day);
  const completed = calcDayCompleted(day);
  const projected = calcDayProjected(day);
  const rows = [
    [tr('macro.calories'), completed.calories, projected.calories, target.calories, 'kcal'],
    [tr('macro.protein'), completed.protein, projected.protein, target.protein, 'g'],
    [tr('macro.carbs'), completed.carbs, projected.carbs, target.carbs, 'g'],
    [tr('macro.fat'), completed.fat, projected.fat, target.fat, 'g'],
  ];
  const foodRows = flattenMealItems(day.meals).map(({ meal, item, food }) => `<tr><td>${mealLabel(meal.slot)}</td><td>${escapeHtml(item.foodName)}</td><td>${escapeHtml(displayQuantity(item))}</td><td>${confidencePill(item.confidence || food?.confidence || 'unknown')}</td><td class="small muted">${escapeHtml(food?.sourceProvider || item.source || 'missing')}</td></tr>`).join('');
  return html`
    <div class="stack">
      ${targetSummaryCards(target, completed, projected)}
      <div class="table-wrap"><table><thead><tr><th>Macro</th><th>${tr('macro.consumed')}</th><th>${tr('macro.projected')}</th><th>${tr('macro.target')}</th><th>${tr('macro.difference')}</th></tr></thead><tbody>${rows.map(([label, done, planned, goal, unit]) => `<tr><td><strong>${label}</strong></td><td>${round(done, unit === 'kcal' ? 0 : 1)} ${unit}</td><td>${round(planned, unit === 'kcal' ? 0 : 1)} ${unit}</td><td>${round(goal, unit === 'kcal' ? 0 : 1)} ${unit}</td><td>${round(planned - goal, unit === 'kcal' ? 0 : 1)} ${unit}</td></tr>`).join('')}</tbody></table></div>
      <section class="card flat stack-sm"><h3>${tr('detail.mealContribution')}</h3>${day.meals.map((meal) => `<div class="day-summary"><strong>${mealLabel(meal.slot)}</strong><span>${totalsText(calcMealMacros(meal))}</span></div>`).join('')}</section>
      <section class="card flat stack-sm"><h3>${tr('detail.foodAssumptions')}</h3><div class="table-wrap"><table><thead><tr><th>Meal</th><th>Food</th><th>Qty</th><th>${tr('common.confidence')}</th><th>${tr('common.source')}</th></tr></thead><tbody>${foodRows}</tbody></table></div></section>
      <div class="actions"><button class="primary-button" data-action="open-target-editor">Edit macro targets</button><button class="secondary-button" data-action="regenerate-day" data-date="${day.date}">Re-optimize day</button><button class="ghost-button" data-action="open-food-lookup">Resolve missing nutrition data</button></div>
    </div>`;
}

function renderProgressDetail(day) {
  const target = getTargetForDay(day);
  const completed = calcDayCompleted(day);
  const projected = calcDayProjected(day);
  const completedMeals = day.meals.filter((m) => m.status === 'completed');
  const skippedMeals = day.meals.filter((m) => m.status === 'skipped');
  const remainingMeals = day.meals.filter((m) => m.status === 'planned');
  return html`
    <div class="stack">
      <div class="info-box small">${tr('progress.explainer')}</div>
      ${progressRows(target, completed, projected, day, true)}
      <div class="grid three">
        <div class="card flat stack-sm"><h3>${tr('common.completed')}</h3><p>${completedMeals.map((m) => mealLabel(m.slot)).join(', ') || '—'}</p></div>
        <div class="card flat stack-sm"><h3>${tr('common.skipped')}</h3><p>${skippedMeals.map((m) => mealLabel(m.slot)).join(', ') || '—'}</p></div>
        <div class="card flat stack-sm"><h3>Remaining</h3><p>${remainingMeals.map((m) => mealLabel(m.slot)).join(', ') || '—'}</p></div>
      </div>
      <div class="card flat stack-sm"><h3>${tr('macro.difference')}</h3>${macroDiffHtml(projected, target)}</div>
    </div>`;
}

function renderWorkoutDetail(day) {
  return html`<div class="stack"><div class="info-box small">Mark workout time to convert the meal before training into a lower-fat pre-workout meal.</div>${renderWorkoutControls(day)}</div>`;
}

function renderGroceryDetail(day) {
  const list = buildGroceryList(day.date, day.date);
  return html`<div class="stack"><p class="muted small">Today-only grocery summary based on planned meals.</p>${renderGroceryDepartments(list)}</div>`;
}

function renderPrepDetail(day) {
  const monday = startOfWeekISO(day.date);
  const list = buildGroceryList(monday, addDays(monday, 4));
  return html`<div class="stack"><p class="muted small">Prep summary for ${escapeHtml(formatDate(monday))} – ${escapeHtml(formatDate(addDays(monday, 4)))}.</p>${renderPrepInstructions(list, 'work week')}</div>`;
}

function renderWorkoutControls(day) {
  return html`
    <div class="form-grid three">
      <label class="checkbox-row"><input type="checkbox" id="workoutIsToday" ${day.workout?.isWorkout ? 'checked' : ''}> <span>Workout day</span></label>
      <label class="field"><span>Workout time</span><input type="time" id="workoutTime" value="${escapeHtml(day.workout?.time || '18:30')}"></label>
      <label class="field"><span>Type</span><select id="workoutType">
        ${['Strength', 'Cardio', 'Mixed', 'Rest'].map((v) => `<option ${day.workout?.type === v ? 'selected' : ''}>${v}</option>`).join('')}
      </select></label>
    </div>
    <button class="primary-button" data-action="apply-workout" data-date="${day.date}">Apply workout logic</button>
    ${day.workout?.reason ? `<div class="info-box small">${escapeHtml(day.workout.reason)}</div>` : ''}`;
}

function renderMealCard(day, meal) {
  const macros = calcMealMacros(meal);
  const statusClass = meal.status === 'completed' ? 'completed' : meal.status === 'skipped' ? 'skipped' : '';
  const statusText = meal.status === 'completed' ? tr('common.completed') : meal.status === 'skipped' ? tr('common.skipped') : tr('common.planned');
  const checkText = meal.status === 'completed' ? '✓' : meal.status === 'skipped' ? '×' : '';
  return html`
    <article class="meal-card ${statusClass}" data-action="open-meal-detail" data-date="${day.date}" data-meal-id="${meal.id}">
      <div class="meal-main">
        <button class="check-circle ${statusClass}" data-action="toggle-meal" data-date="${day.date}" data-meal-id="${meal.id}" aria-label="Toggle ${escapeHtml(meal.slot)} completion">${checkText}</button>
        <div class="stack-sm">
          <div class="row between no-wrap">
            <div>
              <h3>${escapeHtml(mealLabel(meal.slot))}</h3>
              <div class="small muted">${escapeHtml(meal.time || '')} · ${escapeHtml(meal.recipeName || 'Meal')}</div>
            </div>
            <span class="status-pill ${meal.status === 'completed' ? 'good' : meal.status === 'skipped' ? 'bad' : ''}">${statusText}</span>
          </div>
          <ul class="food-list">
            ${(meal.items || []).map((item) => `<li><strong>${escapeHtml(item.foodName)}</strong><span>${displayQuantity(item)}</span></li>`).join('') || '<li><span>No foods yet</span></li>'}
          </ul>
          <div class="macro-pills">
            <span class="macro-pill">${round(macros.calories)} kcal</span>
            <span class="macro-pill">P ${round(macros.protein, 1)}g</span>
            <span class="macro-pill">C ${round(macros.carbs, 1)}g</span>
            <span class="macro-pill">F ${round(macros.fat, 1)}g</span>
          </div>
          ${meal.instructions?.length ? `<details class="collapsible small"><summary>Recipe steps</summary><ol>${meal.instructions.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>${meal.storageNotes ? `<p class="muted">${escapeHtml(meal.storageNotes)}</p>` : ''}</details>` : ''}
        </div>
      </div>
      <div class="actions">
        <button class="secondary-button" data-action="complete-meal" data-date="${day.date}" data-meal-id="${meal.id}">${tr('common.completed')}</button>
        <button class="ghost-button" data-action="skip-meal" data-date="${day.date}" data-meal-id="${meal.id}">${tr('common.skipped')}</button>
        <button class="ghost-button" data-action="change-recipe" data-date="${day.date}" data-meal-id="${meal.id}">Change recipe</button>
        <button class="ghost-button" data-action="edit-meal" data-date="${day.date}" data-meal-id="${meal.id}">Edit meal</button>
      </div>
    </article>`;
}

function renderWeek() {
  const monday = startOfWeekISO(todayISO());
  const start = monday;
  const end = addDays(monday, state.settings.includeWeekends ? 6 : 4);
  const plans = state.plans.filter((p) => p.date >= start && p.date <= addDays(monday, 6)).sort(sortByDate);
  return html`
    <div class="stack">
      <section class="card stack">
        <div class="card-title-row">
          <div>
            <h2>Generate weekly plan</h2>
            <p class="muted small">Default is Monday–Friday. Plans are generated from the baseline diet and adjusted toward your macro target.</p>
          </div>
        </div>
        <div class="form-grid three">
          <label class="field"><span>Start date</span><input type="date" id="weekStart" value="${start}"></label>
          <label class="field"><span>End date</span><input type="date" id="weekEnd" value="${end}"></label>
          <label class="field"><span>Lunch mode</span><select id="weekLunchMode">
            <option value="same" ${state.settings.lunchMode === 'same' ? 'selected' : ''}>Same lunch for workdays</option>
            <option value="rotating" ${state.settings.lunchMode === 'rotating' ? 'selected' : ''}>2–3 rotating work lunches</option>
            <option value="baseline" ${state.settings.lunchMode === 'baseline' ? 'selected' : ''}>Baseline lunch only</option>
          </select></label>
        </div>
        <label class="checkbox-row"><input type="checkbox" id="weekIncludeWeekends" ${state.settings.includeWeekends ? 'checked' : ''}> <span>Include weekends</span></label>
        <div class="actions">
          <button class="primary-button" data-action="generate-week-from-form">Generate / overwrite selected dates</button>
          <button class="ghost-button" data-action="open-baseline-editor">Edit baseline diet</button>
          <button class="ghost-button" data-action="open-target-editor">Edit macros</button>
        </div>
      </section>

      <section class="grid two">
        ${plans.length ? plans.map(renderDayPlanCard).join('') : '<div class="card"><h2>No plans in this week</h2><p class="muted">Generate a plan to see daily meals.</p></div>'}
      </section>
    </div>`;
}

function renderDayPlanCard(day) {
  const target = getTargetForDay(day);
  const projected = calcDayProjected(day);
  const completed = calcDayCompleted(day);
  return html`
    <article class="card day-card">
      <div class="card-title-row">
        <div>
          <h2>${formatDate(day.date, { weekday: 'long', month: 'short', day: 'numeric' })}</h2>
          <p class="muted small">${day.workout?.isWorkout ? `Workout ${escapeHtml(day.workout.time)} · ${escapeHtml(day.workout.type)}` : 'Normal day'}</p>
        </div>
        <button class="pill-button" data-action="regenerate-day" data-date="${day.date}">Regenerate</button>
      </div>
      <div class="day-summary">
        <div class="small"><strong>Projected:</strong> ${totalsText(projected)}</div>
        <div class="small"><strong>Completed:</strong> ${totalsText(completed)}</div>
        ${macroDiffHtml(projected, target)}
      </div>
      <div class="stack-sm">
        ${day.meals.map((meal) => {
          const m = calcMealMacros(meal);
          return `<div class="row between small"><span><strong>${escapeHtml(meal.slot)}</strong> · ${escapeHtml(meal.recipeName || '')}</span><span>${round(m.calories)} kcal · P ${round(m.protein)} C ${round(m.carbs)} F ${round(m.fat)}</span></div>`;
        }).join('')}
      </div>
      <div class="actions">
        <button class="ghost-button" data-action="view-day" data-date="${day.date}">View details</button>
        <button class="ghost-button" data-action="regenerate-day" data-date="${day.date}">Regenerate day</button>
      </div>
    </article>`;
}

function renderGrocery() {
  const monday = startOfWeekISO(todayISO());
  const start = localStorage.getItem('grocery.start') || monday;
  const end = localStorage.getItem('grocery.end') || addDays(monday, 4);
  const selectedSlots = getGrocerySlots();
  const list = buildGroceryList(start, end, selectedSlots);
  return html`
    <div class="stack">
      <section class="card stack">
        <div class="card-title-row">
          <div>
            <h2>Grocery list</h2>
            <p class="muted small">Combines duplicate ingredients across selected plans and groups them by department.</p>
          </div>
        </div>
        <div class="form-grid three">
          <label class="field"><span>Start date</span><input type="date" id="groceryStart" value="${start}"></label>
          <label class="field"><span>End date</span><input type="date" id="groceryEnd" value="${end}"></label>
          <label class="field"><span>Range</span><button class="secondary-button" data-action="update-grocery-range">Update list</button></label>
        </div>
        <div class="section-tabs">
          ${MEAL_SLOTS.map(({ slot }) => `<label class="pill-button"><input type="checkbox" class="grocery-slot" value="${slot}" ${selectedSlots.includes(slot) ? 'checked' : ''}> ${slot}</label>`).join('')}
        </div>
      </section>

      ${list.items.length ? renderGroceryDepartments(list) : '<div class="card"><h2>No grocery items</h2><p class="muted">Generate plans or broaden your date/meal filters.</p></div>'}
    </div>`;
}

function getGrocerySlots() {
  const stored = localStorage.getItem('grocery.slots');
  if (!stored) return MEAL_SLOTS.map((m) => m.slot);
  try { return JSON.parse(stored); } catch { return MEAL_SLOTS.map((m) => m.slot); }
}

function buildGroceryList(start, end, slots = MEAL_SLOTS.map((m) => m.slot)) {
  const dates = eachDate(start, end, true);
  const map = new Map();
  for (const day of state.plans.filter((p) => dates.includes(p.date))) {
    for (const meal of day.meals.filter((m) => slots.includes(m.slot) && m.status !== 'skipped')) {
      for (const item of meal.items || []) {
        const food = getFoodById(item.foodId);
        const key = item.foodId || normalizeText(item.foodName);
        const existing = map.get(key) || {
          key,
          foodId: item.foodId,
          name: item.foodName,
          grams: 0,
          department: food?.department || 'Other',
          unitGrams: food?.unitGrams || 100,
          defaultUnit: food?.defaultUnit || 'g',
          uses: [],
        };
        existing.grams += Number(item.grams) || 0;
        existing.uses.push(`${formatDate(day.date)} ${meal.slot}`);
        map.set(key, existing);
      }
    }
  }
  const items = [...map.values()].sort((a, b) => {
    const dep = DEPARTMENTS.indexOf(a.department) - DEPARTMENTS.indexOf(b.department);
    return dep || a.name.localeCompare(b.name);
  });
  return { start, end, slots, items };
}

function displayGroceryQuantity(item) {
  if (item.defaultUnit === 'piece') {
    const pieces = item.grams / (item.unitGrams || 100);
    return `${round(pieces, pieces % 1 ? 2 : 0)} pieces`;
  }
  if (item.grams >= 1000) return `${round(item.grams / 1000, 2)} kg`;
  return `${round(item.grams)} g`;
}

function groceryCheckedKey(item) {
  return `shopping.checked.${item.key}`;
}

function renderGroceryDepartments(list) {
  const grouped = Object.groupBy ? Object.groupBy(list.items, (item) => item.department) : groupBy(list.items, (item) => item.department);
  return DEPARTMENTS.filter((dep) => grouped[dep]?.length).map((dep) => html`
    <section class="card stack">
      <h2>${dep}</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Buy</th><th>Food</th><th>Quantity</th><th>Used for</th></tr></thead>
          <tbody>
            ${grouped[dep].map((item) => `<tr>
              <td><input type="checkbox" data-action="toggle-shopping" data-key="${escapeHtml(item.key)}" ${localStorage.getItem(groceryCheckedKey(item)) === 'true' ? 'checked' : ''}></td>
              <td><strong>${escapeHtml(item.name)}</strong></td>
              <td>${displayGroceryQuantity(item)}</td>
              <td class="small muted">${escapeHtml([...new Set(item.uses)].slice(0, 8).join(', '))}${item.uses.length > 8 ? '…' : ''}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </section>`).join('');
}

function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] ||= [];
    acc[key].push(item);
    return acc;
  }, {});
}

function renderPrep() {
  const monday = startOfWeekISO(todayISO());
  const start = localStorage.getItem('prep.start') || monday;
  const end = localStorage.getItem('prep.end') || addDays(monday, 4);
  const list = buildGroceryList(start, end, ['Lunch']);
  const allMeals = buildGroceryList(start, end, MEAL_SLOTS.map((m) => m.slot));
  return html`
    <div class="stack">
      <section class="card stack">
        <div class="card-title-row">
          <div>
            <h2>Meal prep planner</h2>
            <p class="muted small">Creates practical instructions from the currently planned meals.</p>
          </div>
          <span class="status-pill blue">Prep day: ${escapeHtml(state.settings.prepDay)}</span>
        </div>
        <div class="form-grid three">
          <label class="field"><span>Start date</span><input type="date" id="prepStart" value="${start}"></label>
          <label class="field"><span>End date</span><input type="date" id="prepEnd" value="${end}"></label>
          <label class="field"><span>Update</span><button class="secondary-button" data-action="update-prep-range">Update prep plan</button></label>
        </div>
      </section>

      <section class="grid two">
        <div class="card stack">
          <h2>${escapeHtml(state.settings.prepDay)} lunch prep</h2>
          ${renderPrepInstructions(list, 'Lunch')}
        </div>
        <div class="card stack">
          <h2>All selected meals</h2>
          ${renderPrepInstructions(allMeals, 'All meals')}
        </div>
      </section>
    </div>`;
}

function renderPrepInstructions(list, label) {
  if (!list.items.length) return '<p class="muted">No selected planned ingredients.</p>';
  const rice = list.items.find((i) => normalizeText(i.name).includes('rice'));
  const chicken = list.items.find((i) => normalizeText(i.name).includes('chicken'));
  const veg = list.items.find((i) => normalizeText(i.name).includes('vegetable'));
  const oil = list.items.find((i) => normalizeText(i.name).includes('olive oil'));
  return html`
    <div class="info-box small">${label}: ${formatDate(list.start)} to ${formatDate(list.end)}. Oil and delicate items are best added after reheating.</div>
    <ul class="food-list">
      ${list.items.map((item) => `<li><strong>${escapeHtml(item.name)}</strong><span>${displayGroceryQuantity(item)}</span></li>`).join('')}
    </ul>
    <details class="collapsible" open>
      <summary>Checklist</summary>
      <div class="stack-sm small">
        ${rice ? `<label class="checkbox-row"><input type="checkbox"> <span>Cook ${displayGroceryQuantity(rice)} rice from dry weight.</span></label>` : ''}
        ${chicken ? `<label class="checkbox-row"><input type="checkbox"> <span>Cook ${displayGroceryQuantity(chicken)} chicken breast; season simply.</span></label>` : ''}
        ${veg ? `<label class="checkbox-row"><input type="checkbox"> <span>Cook, steam, or wash ${displayGroceryQuantity(veg)} vegetables.</span></label>` : ''}
        <label class="checkbox-row"><input type="checkbox"> <span>Portion meals into dated containers.</span></label>
        ${oil ? `<label class="checkbox-row"><input type="checkbox"> <span>Add olive oil after reheating where possible: total ${displayGroceryQuantity(oil)}.</span></label>` : ''}
        <label class="checkbox-row"><input type="checkbox"> <span>Keep Monday–Wednesday portions in the fridge.</span></label>
        <label class="checkbox-row"><input type="checkbox"> <span>Freeze later portions if food safety or freshness is uncertain.</span></label>
      </div>
    </details>
    <div class="warning-box small">Storage guidance is generic. Use local food-safety standards and package instructions.</div>`;
}

function renderProgress() {
  const analysis = buildHistoricalAnalysis();
  return html`
    <div class="stack">
      <section class="grid three">
        <div class="card metric"><span>Tracked days</span><strong>${analysis.days}</strong><div class="small muted">Plans stored locally</div></div>
        <div class="card metric"><span>Average completed calories</span><strong>${round(analysis.avgCalories)} kcal</strong><div class="small muted">Days with completion data</div></div>
        <div class="card metric"><span>Macro adherence</span><strong>${round(analysis.adherence)}%</strong><div class="small muted">Completed calories ÷ targets</div></div>
      </section>

      <section class="grid two">
        <div class="card stack">
          <div class="card-title-row"><div><h2>Simple summaries</h2><p class="muted small">No diagnosis. These are mechanical summaries of logged values.</p></div></div>
          <div class="stack-sm">
            ${analysis.sentences.map((s) => `<div class="info-box small">${escapeHtml(s)}</div>`).join('')}
          </div>
          <div class="actions">
            <button class="secondary-button" data-action="nav" data-view="body">Body data</button>
            <button class="secondary-button" data-action="nav" data-view="blood">Blood exams</button>
          </div>
        </div>
        <div class="card stack">
          <h2>Skipped meals</h2>
          ${analysis.skippedRows.length ? `<div class="table-wrap"><table><thead><tr><th>Meal</th><th>Skipped count</th></tr></thead><tbody>${analysis.skippedRows.map(([slot, count]) => `<tr><td>${slot}</td><td>${count}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No skipped meals yet.</p>'}
        </div>
      </section>

      <section class="card stack">
        <h2>Monthly macro summary</h2>
        ${analysis.monthRows.length ? `<div class="table-wrap"><table><thead><tr><th>Month</th><th>Days</th><th>Completed kcal avg</th><th>Protein avg</th><th>Carbs avg</th><th>Fat avg</th></tr></thead><tbody>${analysis.monthRows.map((r) => `<tr><td>${r.month}</td><td>${r.days}</td><td>${round(r.calories)}</td><td>${round(r.protein, 1)}g</td><td>${round(r.carbs, 1)}g</td><td>${round(r.fat, 1)}g</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No historical completion data yet.</p>'}
      </section>
    </div>`;
}

function buildHistoricalAnalysis() {
  const days = state.plans.length;
  const completedDays = state.plans.filter((p) => p.meals.some((m) => m.status === 'completed'));
  const completedTotals = completedDays.map((p) => ({ date: p.date, target: getTargetForDay(p), total: calcDayCompleted(p), workout: p.workout?.isWorkout }));
  const sum = completedTotals.reduce((acc, x) => addMacros(acc, x.total), emptyMacros());
  const targetSum = completedTotals.reduce((acc, x) => addMacros(acc, x.target), emptyMacros());
  const avgCalories = completedTotals.length ? sum.calories / completedTotals.length : 0;
  const adherence = targetSum.calories ? (sum.calories / targetSum.calories) * 100 : 0;
  const skipped = new Map();
  for (const plan of state.plans) {
    for (const meal of plan.meals.filter((m) => m.status === 'skipped')) skipped.set(meal.slot, (skipped.get(meal.slot) || 0) + 1);
  }
  const skippedRows = [...skipped.entries()].sort((a, b) => b[1] - a[1]);

  const workoutDays = completedTotals.filter((x) => x.workout);
  const restDays = completedTotals.filter((x) => !x.workout);
  const avg = (arr, key) => arr.length ? arr.reduce((s, x) => s + x.total[key], 0) / arr.length : 0;
  const sentences = [];
  sentences.push(`You have ${days} planned day${days === 1 ? '' : 's'} and ${completedDays.length} day${completedDays.length === 1 ? '' : 's'} with at least one completed meal.`);
  if (completedTotals.length) sentences.push(`Average completed intake is ${round(avgCalories)} kcal, ${round(sum.protein / completedTotals.length, 1)}g protein, ${round(sum.carbs / completedTotals.length, 1)}g carbs, and ${round(sum.fat / completedTotals.length, 1)}g fat.`);
  if (workoutDays.length && restDays.length) sentences.push(`Average completed calories were ${round(avg(workoutDays, 'calories'))} kcal on workout days versus ${round(avg(restDays, 'calories'))} kcal on non-workout days.`);
  if (state.bodyEntries.length >= 2) {
    const first = state.bodyEntries[0];
    const last = state.bodyEntries[state.bodyEntries.length - 1];
    if (first.bodyWeight && last.bodyWeight) sentences.push(`Body weight changed from ${first.bodyWeight} kg to ${last.bodyWeight} kg between ${formatDate(first.date)} and ${formatDate(last.date)}.`);
    if (first.bodyFatPct && last.bodyFatPct) sentences.push(`Body-fat percentage changed from ${first.bodyFatPct}% to ${last.bodyFatPct}%.`);
  }
  if (!sentences.length) sentences.push('Complete meals and add body data to unlock summaries.');

  const byMonth = new Map();
  for (const x of completedTotals) {
    const month = x.date.slice(0, 7);
    const row = byMonth.get(month) || { month, days: 0, calories: 0, protein: 0, carbs: 0, fat: 0 };
    row.days += 1;
    row.calories += x.total.calories;
    row.protein += x.total.protein;
    row.carbs += x.total.carbs;
    row.fat += x.total.fat;
    byMonth.set(month, row);
  }
  const monthRows = [...byMonth.values()].map((r) => ({ ...r, calories: r.calories / r.days, protein: r.protein / r.days, carbs: r.carbs / r.days, fat: r.fat / r.days })).sort((a, b) => a.month.localeCompare(b.month));
  return { days, avgCalories, adherence, skippedRows, sentences, monthRows };
}

function renderBody() {
  return html`
    <div class="stack">
      <section class="card stack">
        <div class="card-title-row">
          <div><h2>Body composition entry</h2><p class="muted small">Manual entry. Values are stored locally on this device.</p></div>
        </div>
        <div class="form-grid three">
          ${bodyField('date', 'Date', 'date', todayISO())}
          ${bodyField('bodyWeight', 'Body weight (kg)', 'number')}
          ${bodyField('bodyFatPct', 'Body fat %', 'number')}
          ${bodyField('fatMass', 'Fat mass (kg)', 'number')}
          ${bodyField('leanMass', 'Lean mass (kg)', 'number')}
          ${bodyField('muscleMass', 'Muscle mass (kg)', 'number')}
          ${bodyField('skeletalMuscleMass', 'Skeletal muscle mass (kg)', 'number')}
          ${bodyField('visceralFat', 'Visceral fat', 'number')}
          ${bodyField('waterPct', 'Water %', 'number')}
          ${bodyField('bmi', 'BMI', 'number')}
          ${bodyField('bmr', 'BMR', 'number')}
          ${bodyField('waist', 'Waist (cm)', 'number')}
          ${bodyField('chest', 'Chest (cm)', 'number')}
          ${bodyField('arm', 'Arm (cm)', 'number')}
          ${bodyField('leg', 'Leg (cm)', 'number')}
        </div>
        <label class="field"><span>Notes</span><textarea id="body_notes" placeholder="Measurement conditions, device, hydration, etc."></textarea></label>
        <div class="actions">
          <button class="primary-button" data-action="save-body-entry">Save body entry</button>
          <button class="ghost-button" data-action="export-body-csv">Export body CSV</button>
        </div>
      </section>

      <section class="grid two">
        <div class="card stack">
          <h2>Weight trend</h2>
          ${renderLineChart(state.bodyEntries, 'bodyWeight', 'kg')}
        </div>
        <div class="card stack">
          <h2>Body-fat trend</h2>
          ${renderLineChart(state.bodyEntries, 'bodyFatPct', '%')}
        </div>
      </section>

      <section class="card stack">
        <h2>History</h2>
        ${renderBodyTable()}
      </section>
    </div>`;
}

function bodyField(id, label, type = 'number', value = '') {
  return `<label class="field"><span>${label}</span><input id="body_${id}" type="${type}" value="${escapeHtml(value)}" step="0.1"></label>`;
}

function renderLineChart(entries, key, unit) {
  const points = entries.filter((e) => e[key] !== '' && e[key] != null && !Number.isNaN(Number(e[key]))).map((e) => ({ date: e.date, value: Number(e[key]) }));
  if (points.length < 2) return '<div class="chart"><p class="muted small">Add at least two entries to show a trend.</p></div>';
  const w = 640, h = 220, pad = 34;
  const min = Math.min(...points.map((p) => p.value));
  const max = Math.max(...points.map((p) => p.value));
  const span = max - min || 1;
  const coords = points.map((p, i) => {
    const x = pad + (i * (w - pad * 2)) / (points.length - 1);
    const y = h - pad - ((p.value - min) / span) * (h - pad * 2);
    return { ...p, x, y };
  });
  const poly = coords.map((p) => `${p.x},${p.y}`).join(' ');
  return html`<div class="chart"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${key} trend chart">
    <line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="currentColor" opacity="0.25" />
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h - pad}" stroke="currentColor" opacity="0.25" />
    <polyline fill="none" stroke="currentColor" stroke-width="4" points="${poly}" />
    ${coords.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="currentColor"><title>${p.date}: ${p.value}${unit}</title></circle>`).join('')}
    <text x="${pad}" y="20" font-size="13" fill="currentColor">${round(max, 1)}${unit}</text>
    <text x="${pad}" y="${h - 8}" font-size="13" fill="currentColor">${round(min, 1)}${unit}</text>
  </svg></div>`;
}

function renderBodyTable() {
  if (!state.bodyEntries.length) return '<p class="muted">No body entries yet.</p>';
  return html`<div class="table-wrap"><table>
    <thead><tr><th>Date</th><th>Weight</th><th>Body fat</th><th>Muscle</th><th>Waist</th><th>Notes</th><th></th></tr></thead>
    <tbody>${state.bodyEntries.map((e) => `<tr><td>${formatDate(e.date)}</td><td>${e.bodyWeight || ''}</td><td>${e.bodyFatPct || ''}</td><td>${e.muscleMass || ''}</td><td>${e.waist || ''}</td><td class="small muted">${escapeHtml(e.notes || '')}</td><td><button class="pill-button" data-action="delete-body" data-id="${e.id}">Delete</button></td></tr>`).join('')}</tbody>
  </table></div>`;
}

function renderBlood() {
  return html`
    <div class="stack">
      <section class="card stack">
        <div class="card-title-row">
          <div><h2>Blood exam archive</h2><p class="muted small">Stores original text and structured markers for personal tracking.</p></div>
        </div>
        <div class="warning-box small">Review source documents and professional notes outside the app when needed.</div>
        <div class="form-grid">
          <label class="field"><span>Exam date</span><input id="bloodDate" type="date" value="${todayISO()}"></label>
          <label class="field"><span>Notes</span><input id="bloodNotes" placeholder="Lab, fasting state, medication notes..."></label>
        </div>
        <label class="field"><span>Paste exam text</span><textarea id="bloodText" placeholder="Glucose 91 mg/dL reference 70-99..."></textarea></label>
        <div class="actions">
          <button class="primary-button" data-action="parse-blood">Parse and review</button>
          <button class="ghost-button" data-action="export-blood-csv">Export blood CSV</button>
        </div>
      </section>

      <section class="grid two">
        <div class="card stack">
          <h2>Exams</h2>
          ${renderBloodExamList()}
        </div>
        <div class="card stack">
          <h2>Marker trends</h2>
          ${renderMarkerTrends()}
        </div>
      </section>
    </div>`;
}

function parseBloodMarkers(text) {
  const markers = [];
  const lines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const norm = normalizeText(line);
    const markerName = MARKER_NAMES.find((m) => norm.includes(normalizeText(m)));
    if (!markerName) continue;
    const valueMatch = line.match(/([<>]?)\s*(\d+(?:[.,]\d+)?)/);
    if (!valueMatch) continue;
    const value = Number(valueMatch[2].replace(',', '.'));
    const afterValue = line.slice(valueMatch.index + valueMatch[0].length);
    const unitMatch = afterValue.match(/^\s*([a-zA-Zµμ/%\.]+(?:\/\w+)?)?/);
    const unit = unitMatch?.[1] || '';
    const refMatch = line.match(/(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)/);
    let referenceRange = '';
    let flag = 'unknown';
    if (refMatch) {
      const low = Number(refMatch[1].replace(',', '.'));
      const high = Number(refMatch[2].replace(',', '.'));
      referenceRange = `${low}-${high}`;
      flag = value < low ? 'low' : value > high ? 'high' : 'normal';
    }
    markers.push({ id: uuid('marker'), name: markerName, value, unit, referenceRange, flag, notes: '', originalLine: line });
  }
  return markers;
}

function renderBloodExamList() {
  if (!state.bloodExams.length) return '<p class="muted">No exams yet.</p>';
  return `<div class="stack-sm">${state.bloodExams.map((exam) => `<details class="collapsible"><summary>${formatDate(exam.date)} · ${exam.markers.length} marker${exam.markers.length === 1 ? '' : 's'}</summary>
    <div class="table-wrap"><table><thead><tr><th>Marker</th><th>Value</th><th>Range</th><th>Flag</th></tr></thead><tbody>${exam.markers.map((m) => `<tr><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.value)} ${escapeHtml(m.unit || '')}</td><td>${escapeHtml(m.referenceRange || '')}</td><td>${flagPill(m.flag)}</td></tr>`).join('')}</tbody></table></div>
    <p class="small muted">${escapeHtml(exam.notes || '')}</p>
    <button class="pill-button" data-action="delete-blood" data-id="${exam.id}">Delete exam</button>
  </details>`).join('')}</div>`;
}

function flagPill(flag) {
  const cls = flag === 'normal' ? 'good' : flag === 'high' || flag === 'low' ? 'warn' : '';
  return `<span class="status-pill ${cls}">${escapeHtml(flag || 'unknown')}</span>`;
}

function renderMarkerTrends() {
  const markerMap = new Map();
  for (const exam of state.bloodExams) {
    for (const marker of exam.markers) {
      if (!markerMap.has(marker.name)) markerMap.set(marker.name, []);
      markerMap.get(marker.name).push({ date: exam.date, value: marker.value, unit: marker.unit });
    }
  }
  const rows = [...markerMap.entries()].filter(([, vals]) => vals.length >= 2);
  if (!rows.length) return '<p class="muted">Add at least two exams with the same marker to show trends.</p>';
  return `<div class="stack-sm">${rows.map(([name, vals]) => {
    vals.sort((a, b) => a.date.localeCompare(b.date));
    const first = vals[0];
    const last = vals[vals.length - 1];
    const diff = last.value - first.value;
    return `<div class="info-box small"><strong>${escapeHtml(name)}</strong>: ${first.value}${escapeHtml(first.unit || '')} → ${last.value}${escapeHtml(last.unit || '')} (${diff > 0 ? '+' : ''}${round(diff, 2)})</div>`;
  }).join('')}</div>`;
}

function __legacy_renderSettings_1_unused() {
  return html`
    <div class="stack">
      <section class="grid two">
        <div class="card stack">
          <div class="card-title-row"><div><h2>${tr('settings.localProfile')}</h2><p class="muted small">${tr('settings.localProfileNote')}</p></div></div>
          <div class="day-summary"><strong>${escapeHtml(state.activeProfile?.displayName || 'Local User')}</strong><span class="muted small">${escapeHtml(state.activeProfile?.email || 'No email stored')}</span></div>
          <button class="ghost-button" data-action="logout-profile">${tr('profile.logout')}</button>
        </div>
        <div class="card stack" id="macroSettingsCard">
          <div class="card-title-row"><div><h2>Macro targets</h2><p class="muted small">Calorie mismatch warnings do not block saving.</p></div></div>
          ${renderMacroForm()}
        </div>
      </section>

      <section class="card stack">
        <div class="card-title-row"><div><h2>${tr('nav.settings')}</h2><p class="muted small">Language, theme, provider keys, and local generation defaults.</p></div></div>
        ${renderPreferencesForm()}
      </section>

      <section class="card stack" id="baselineSettingsCard">
        <div class="card-title-row"><div><h2>Baseline nutritionist diet</h2><p class="muted small">Paste text, parse it, review structured meals, then save.</p></div></div>
        <textarea id="baselineText">${escapeHtml(state.baseline?.rawText || SAMPLE_BASELINE)}</textarea>
        <div class="actions">
          <button class="primary-button" data-action="parse-baseline">Parse and review</button>
          <button class="ghost-button" data-action="reset-sample-baseline">Load sample baseline</button>
        </div>
      </section>

      <section class="card stack">
        <div class="card-title-row">
          <div><h2>Food nutrition database</h2><p class="muted small">Per-100g values. Seed values are estimates; brand and cooking method can change macros.</p></div>
          <button class="secondary-button" data-action="open-food-editor">Add food</button>
        </div>
        <div class="actions">
          <button class="ghost-button" data-action="open-food-lookup">${tr('lookup.title')}</button>
          <button class="ghost-button" data-action="export-food-csv">Export foods CSV</button>
        </div>
        <div class="warning-box small">${tr('warning.seedValues')}</div>
        ${renderFoodTable()}
      </section>

      <section class="grid two">
        <div class="card stack">
          <h2>Backup</h2>
          <p class="muted small">Export/import JSON keeps the app private and device-local by default.</p>
          <div class="actions">
            <button class="primary-button" data-action="export-json">Export backup JSON</button>
            <label class="secondary-button">Import backup JSON<input id="importJson" type="file" accept="application/json" hidden></label>
          </div>
        </div>
        <div class="card stack">
          <h2>Nutrition data strategy</h2>
          <p class="muted small">The app works offline from cached/manual foods. External nutrition lookup goes through Diet Planner Cloud; provider keys are configured only on the backend.</p>
          <div class="warning-box small">Do not treat seed food values as precise. Verify brand labels, raw vs cooked weight, and your nutritionist instructions.</div>
        </div>
      </section>

    </div>`;
}

function __legacy_renderMacroForm_1_unused() {
  const t = state.target;
  return html`
    <div class="form-grid">
      ${macroInput('calories', 'Daily calories target', t.calories, 'kcal')}
      ${macroInput('protein', 'Daily protein target', t.protein, 'g')}
      ${macroInput('carbs', 'Daily carbs target', t.carbs, 'g')}
      ${macroInput('fat', 'Daily fat target', t.fat, 'g')}
      ${macroInput('tolCalories', 'Calories tolerance %', t.tolerance?.caloriesPct ?? 5, '%')}
      ${macroInput('tolProtein', 'Protein tolerance g', t.tolerance?.protein ?? 5, 'g')}
      ${macroInput('tolCarbs', 'Carbs tolerance g', t.tolerance?.carbs ?? 10, 'g')}
      ${macroInput('tolFat', 'Fat tolerance g', t.tolerance?.fat ?? 5, 'g')}
    </div>
    <label class="field"><span>Notes</span><textarea id="macro_notes">${escapeHtml(t.notes || '')}</textarea></label>
    ${macroValidationMessage(t)}
    <details class="collapsible">
      <summary>Optional workout/rest targets</summary>
      <div class="grid two">
        <div class="stack-sm">
          <label class="checkbox-row"><input type="checkbox" id="workoutTargetEnabled" ${t.workout?.enabled ? 'checked' : ''}> <span>Use workout-day targets</span></label>
          <div class="form-grid">
            ${macroInput('workoutCalories', 'Workout calories', t.workout?.calories ?? t.calories, 'kcal')}
            ${macroInput('workoutProtein', 'Workout protein', t.workout?.protein ?? t.protein, 'g')}
            ${macroInput('workoutCarbs', 'Workout carbs', t.workout?.carbs ?? t.carbs, 'g')}
            ${macroInput('workoutFat', 'Workout fat', t.workout?.fat ?? t.fat, 'g')}
          </div>
        </div>
        <div class="stack-sm">
          <label class="checkbox-row"><input type="checkbox" id="restTargetEnabled" ${t.rest?.enabled ? 'checked' : ''}> <span>Use rest-day targets</span></label>
          <div class="form-grid">
            ${macroInput('restCalories', 'Rest calories', t.rest?.calories ?? t.calories, 'kcal')}
            ${macroInput('restProtein', 'Rest protein', t.rest?.protein ?? t.protein, 'g')}
            ${macroInput('restCarbs', 'Rest carbs', t.rest?.carbs ?? t.carbs, 'g')}
            ${macroInput('restFat', 'Rest fat', t.rest?.fat ?? t.fat, 'g')}
          </div>
        </div>
      </div>
    </details>
    <button class="primary-button" data-action="save-target">Save macros</button>`;
}

function macroInput(id, label, value, unit) {
  return `<label class="field"><span>${label}</span><input id="macro_${id}" type="number" step="0.1" value="${escapeHtml(value)}" aria-label="${label}"><small class="muted">${unit}</small></label>`;
}

function readMacroForm() {
  const n = (id) => Number($(`macro_${id}`)?.value || 0);
  return {
    id: 'default',
    calories: n('calories'),
    protein: n('protein'),
    carbs: n('carbs'),
    fat: n('fat'),
    notes: $('macro_notes')?.value || '',
    tolerance: { caloriesPct: n('tolCalories'), protein: n('tolProtein'), carbs: n('tolCarbs'), fat: n('tolFat') },
    workout: { enabled: $('workoutTargetEnabled')?.checked || false, calories: n('workoutCalories'), protein: n('workoutProtein'), carbs: n('workoutCarbs'), fat: n('workoutFat') },
    rest: { enabled: $('restTargetEnabled')?.checked || false, calories: n('restCalories'), protein: n('restProtein'), carbs: n('restCarbs'), fat: n('restFat') },
  };
}

function __legacy_renderPreferencesForm_1_unused() {
  const s = state.settings;
  return html`
    <div class="form-grid">
      <label class="field"><span>${tr('settings.language')}</span><select id="pref_language"><option value="en" ${normalizeLanguage(s.language) === 'en' ? 'selected' : ''}>English</option><option value="it" ${normalizeLanguage(s.language) === 'it' ? 'selected' : ''}>Italiano</option></select></label>
      <label class="field"><span>${tr('settings.theme')}</span><select id="pref_theme"><option value="system" ${s.theme === 'system' ? 'selected' : ''}>${tr('settings.themeSystem')}</option><option value="light" ${s.theme === 'light' ? 'selected' : ''}>${tr('settings.themeLight')}</option><option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>${tr('settings.themeDark')}</option></select></label>
      <label class="field"><span>Prep day</span><select id="pref_prepDay">${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => `<option ${s.prepDay === d ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
      <label class="field"><span>Lunch mode</span><select id="pref_lunchMode">
        <option value="same" ${s.lunchMode === 'same' ? 'selected' : ''}>Same lunch Monday–Friday</option>
        <option value="rotating" ${s.lunchMode === 'rotating' ? 'selected' : ''}>2–3 rotating work lunches</option>
        <option value="baseline" ${s.lunchMode === 'baseline' ? 'selected' : ''}>Baseline lunch</option>
      </select></label>
      <label class="field"><span>Units</span><select id="pref_units"><option value="metric" ${s.units === 'metric' ? 'selected' : ''}>Metric: g/ml/pieces</option></select></label>
    </div>
    ${prefArea('likedFoods', 'Foods I like')}
    ${prefArea('dislikedFoods', 'Foods I dislike')}
    ${prefArea('excludedFoods', 'Foods to exclude')}
    ${prefArea('allergies', 'Allergies')}
    ${prefArea('preferredProtein', 'Preferred protein sources')}
    ${prefArea('preferredCarbs', 'Preferred carb sources')}
    ${prefArea('preferredFats', 'Preferred fat sources')}
    <button class="primary-button" data-action="save-preferences">Save preferences</button>`;
}

function prefArea(key, label) {
  return `<label class="field"><span>${label}</span><textarea id="pref_${key}" rows="2">${escapeHtml(state.settings[key] || '')}</textarea></label>`;
}

function __legacy_renderFoodTable_1_unused() {
  return html`<div class="table-wrap"><table>
    <thead><tr><th>Food</th><th>Per 100g</th><th>Source</th><th>Confidence</th><th></th></tr></thead>
    <tbody>${state.foods.map((f) => `<tr>
      <td><strong>${escapeHtml(localizedFoodName(f))}</strong><div class="small muted">${escapeHtml((f.aliases || []).slice(0, 4).join(', '))}</div></td>
      <td>${round(f.caloriesPer100g)} kcal · P ${round(f.proteinPer100g, 1)} · C ${round(f.carbsPer100g, 1)} · F ${round(f.fatPer100g, 1)}</td>
      <td class="small muted">${escapeHtml(f.sourceProvider || f.source || '')}</td>
      <td>${confidencePill(f.confidence)}</td>
      <td><button class="pill-button" data-action="open-food-editor" data-food-id="${f.id}">Edit</button></td>
    </tr>`).join('')}</tbody>
  </table></div>`;
}

function confidencePill(confidence) {
  const cls = confidence === 'high' ? 'good' : confidence === 'low' || confidence === 'unknown' ? 'warn' : 'blue';
  return `<span class="status-pill ${cls}">${escapeHtml(confidence || 'unknown')}</span>`;
}

function openModal(title, bodyHtml, options = {}) {
  state.detailFocusReturn = document.activeElement;
  $('modalTitle').textContent = title;
  $('modalBody').innerHTML = bodyHtml;
  $('modal').classList.toggle('detail-panel', Boolean(options.detail));
  $('modal').hidden = false;
  setTimeout(() => $('modalClose')?.focus(), 0);
}

function openDetailPanel(title, bodyHtml) {
  openModal(title, bodyHtml, { detail: true });
}

function closeModal() {
  $('modal').hidden = true;
  $('modal').classList.remove('detail-panel');
  $('modalBody').innerHTML = '';
  if (state.detailFocusReturn?.focus) state.detailFocusReturn.focus();
  state.detailFocusReturn = null;
}

function toast(message) {
  const tmpl = $('toastTemplate');
  const node = tmpl.content.firstElementChild.cloneNode(true);
  node.textContent = message;
  $('toastStack').appendChild(node);
  setTimeout(() => node.remove(), 3300);
}

async function toggleMeal(date, mealId) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  meal.status = meal.status === 'completed' ? 'planned' : 'completed';
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  render();
}

async function setMealStatus(date, mealId, status) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  meal.status = status;
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  render();
}

function askSkipMeal(date, mealId) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  openModal('Skip meal?', html`
    <div class="stack">
      <p>You are marking <strong>${escapeHtml(meal.slot)}</strong> as skipped.</p>
      <p class="muted">The app can remove that meal from expected intake and adjust remaining uncompleted meals toward the original daily macro target.</p>
      <div class="actions">
        <button class="danger-button" data-action="confirm-skip-recalc" data-date="${date}" data-meal-id="${mealId}">Skip and recalculate</button>
        <button class="ghost-button" data-action="confirm-skip-only" data-date="${date}" data-meal-id="${mealId}">Skip only</button>
      </div>
    </div>`);
}

async function skipAndRecalculate(date, mealId, recalc = true) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  meal.status = 'skipped';
  let comparison = null;
  if (recalc) comparison = recalcRemainingMeals(day);
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  closeModal();
  render();
  if (comparison) showRecalcComparison(comparison);
}

function recalcRemainingMeals(day) {
  const target = getTargetForDay(day);
  const completed = calcDayCompleted(day);
  const remainingTarget = subtractMacros(target, completed);
  remainingTarget.calories = Math.max(0, remainingTarget.calories);
  remainingTarget.protein = Math.max(0, remainingTarget.protein);
  remainingTarget.carbs = Math.max(0, remainingTarget.carbs);
  remainingTarget.fat = Math.max(0, remainingTarget.fat);
  const remainingMeals = day.meals.filter((m) => m.status === 'planned' && !m.locked);
  const before = deepClone(remainingMeals).map((m) => ({ slot: m.slot, macros: calcMealMacros(m), items: m.items.map((i) => ({ name: i.foodName, qty: displayQuantity(i) })) }));
  const result = scaleMealsToTarget(remainingMeals, remainingTarget);
  const after = remainingMeals.map((m) => ({ slot: m.slot, macros: calcMealMacros(m), items: m.items.map((i) => ({ name: i.foodName, qty: displayQuantity(i) })) }));
  const projected = calcDayProjected(day);
  const comparison = { date: day.date, remainingTarget, before, after, projected, target, warnings: result.warnings };
  day.recalculationLog ||= [];
  day.recalculationLog.push({ at: new Date().toISOString(), skippedMealHandled: true, projected, warnings: result.warnings });
  return comparison;
}

function showRecalcComparison(c) {
  openModal('Remaining meals recalculated', html`
    <div class="stack">
      <div class="info-box small">To stay close to your daily targets, the app adjusted remaining uncompleted meals. If the target cannot be reached within portion limits, the closest practical result is shown.</div>
      ${c.warnings.length ? `<div class="warning-box small">${c.warnings.map(escapeHtml).join('<br>')}</div>` : ''}
      <div class="grid two">
        <div class="card flat stack-sm"><h3>Before</h3>${renderMiniMealList(c.before)}</div>
        <div class="card flat stack-sm"><h3>After</h3>${renderMiniMealList(c.after)}</div>
      </div>
      <div class="card flat stack-sm">
        <h3>New projected daily totals</h3>
        <div>${totalsText(c.projected)}</div>
        ${macroDiffHtml(c.projected, c.target)}
      </div>
    </div>`);
}

function renderMiniMealList(rows) {
  return rows.length ? rows.map((m) => `<details class="collapsible"><summary>${escapeHtml(m.slot)} · ${totalsText(m.macros)}</summary><ul>${m.items.map((i) => `<li>${escapeHtml(i.name)} — ${escapeHtml(i.qty)}</li>`).join('')}</ul></details>`).join('') : '<p class="muted small">No remaining adjustable meals.</p>';
}

async function __legacy_changeRecipe_1_unused(date, mealId) {
  const day = findPlan(date);
  const idx = day?.meals.findIndex((m) => m.id === mealId);
  if (idx == null || idx < 0) return;
  const original = day.meals[idx];
  const targetMacros = calcMealMacros(original);
  const recipes = RECIPE_LIBRARY.filter((r) => r.slot === original.slot && r.name !== original.recipeName);
  if (!recipes.length) {
    toast('No local alternative recipe for this meal slot yet.');
    return;
  }
  const excluded = normalizeText(state.settings.excludedFoods || '');
  const filtered = recipes.filter((r) => !r.ingredients.some(([foodId]) => excluded.includes(normalizeText(getFoodById(foodId)?.name || foodId))));
  const pool = filtered.length ? filtered : recipes;
  const candidates = pool.map((r) => {
    const meal = createMealFromRecipe(r, date);
    scaleMealsToTarget([meal], targetMacros, { tolerance: { caloriesPct: 8, protein: 8, carbs: 10, fat: 6 } });
    const totals = calcMealMacros(meal);
    const score = Math.abs(totals.calories - targetMacros.calories) + Math.abs(totals.protein - targetMacros.protein) * 15 + Math.abs(totals.carbs - targetMacros.carbs) * 6 + Math.abs(totals.fat - targetMacros.fat) * 9;
    return { recipe: r, meal, totals, score };
  }).sort((a, b) => a.score - b.score);
  const selected = candidates[0].meal;
  selected.id = original.id;
  selected.status = original.status === 'completed' ? 'planned' : original.status;
  selected.originalItems = deepClone(original.originalItems || original.items);
  selected.adjustments = [...(original.adjustments || []), { at: new Date().toISOString(), type: 'recipe_change', from: original.recipeName, to: selected.recipeName }];
  day.meals[idx] = selected;
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  render();
  openModal('Recipe changed', html`
    <div class="stack">
      <div class="success-box small">Changed ${escapeHtml(original.slot)} from <strong>${escapeHtml(original.recipeName || 'original meal')}</strong> to <strong>${escapeHtml(selected.recipeName)}</strong>.</div>
      <div class="grid two">
        <div class="card flat"><h3>Original macros</h3><p>${totalsText(targetMacros)}</p></div>
        <div class="card flat"><h3>New macros</h3><p>${totalsText(calcMealMacros(selected))}</p>${macroDiffHtml(calcMealMacros(selected), targetMacros)}</div>
      </div>
      ${selected.instructions?.length ? `<ol>${selected.instructions.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>` : ''}
    </div>`);
}

function __legacy_openMealDetail_1_unused(date, mealId) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  const macros = calcMealMacros(meal);
  openDetailPanel(mealLabel(meal.slot), html`
    <div class="stack">
      <div class="card flat stack-sm"><h3>${escapeHtml(meal.recipeName || 'Meal')}</h3><p>${totalsText(macros)}</p>${confidencePill((meal.items || []).some((i) => i.confidence === 'unknown') ? 'unknown' : 'medium')}</div>
      <ul class="food-list detail-food-list">${(meal.items || []).map((item) => `<li><strong>${escapeHtml(item.foodName)}</strong><span>${displayQuantity(item)} · ${confidencePill(item.confidence || 'unknown')}</span></li>`).join('')}</ul>
      ${meal.instructions?.length ? `<section class="card flat"><h3>Recipe steps</h3><ol>${meal.instructions.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></section>` : ''}
      <div class="actions"><button class="secondary-button" data-action="complete-meal" data-date="${date}" data-meal-id="${mealId}">${tr('common.completed')}</button><button class="ghost-button" data-action="skip-meal" data-date="${date}" data-meal-id="${mealId}">${tr('common.skipped')}</button><button class="ghost-button" data-action="edit-meal" data-date="${date}" data-meal-id="${mealId}">Edit meal</button></div>
    </div>`);
}

function openMealEditor(date, mealId) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  openModal(`Edit ${meal.slot}`, html`
    <div class="stack">
      <label class="field"><span>Recipe / meal name</span><input id="editMealName" value="${escapeHtml(meal.recipeName || '')}"></label>
      <div class="stack-sm" id="editMealItems">
        ${meal.items.map((item, i) => renderEditMealItem(item, i)).join('')}
      </div>
      <div class="actions">
        <button class="secondary-button" data-action="add-meal-item-row">Add item</button>
        <button class="primary-button" data-action="save-meal-edit" data-date="${date}" data-meal-id="${mealId}">Save meal</button>
      </div>
    </div>`);
}

function renderEditMealItem(item = {}, i = 0) {
  return html`<div class="grid three card flat meal-edit-row">
    <label class="field"><span>Food</span><input class="meal-food" value="${escapeHtml(item.rawName || item.foodName || '')}" list="foodNameList"></label>
    <label class="field"><span>Quantity</span><input class="meal-qty" type="number" step="0.1" value="${escapeHtml(item.quantity ?? item.grams ?? 0)}"></label>
    <label class="field"><span>Unit</span><select class="meal-unit"><option value="g" ${item.unit === 'g' ? 'selected' : ''}>g</option><option value="ml" ${item.unit === 'ml' ? 'selected' : ''}>ml</option><option value="piece" ${item.unit === 'piece' ? 'selected' : ''}>pieces</option></select></label>
  </div>`;
}

async function saveMealEdit(date, mealId) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  const rows = [...document.querySelectorAll('.meal-edit-row')];
  const items = rows.map((row) => {
    const name = row.querySelector('.meal-food').value.trim();
    const qty = Number(row.querySelector('.meal-qty').value || 0);
    const unit = row.querySelector('.meal-unit').value;
    const food = lookupFood(name);
    const normalizedUnit = normalizeUnit(unit, qty, food);
    return {
      id: uuid('item'),
      foodId: food?.id || null,
      foodName: food?.name || name,
      rawName: name,
      quantity: qty,
      unit: normalizedUnit,
      grams: quantityToGrams(qty, normalizedUnit, food),
      originalGrams: quantityToGrams(qty, normalizedUnit, food),
      locked: false,
      notes: '',
      source: food?.source || 'Manual value required',
      confidence: food?.confidence || 'unknown',
    };
  }).filter((item) => item.foodName && item.quantity > 0);
  meal.recipeName = $('editMealName').value.trim() || meal.slot;
  meal.items = items;
  meal.adjustments ||= [];
  meal.adjustments.push({ at: new Date().toISOString(), type: 'manual_edit' });
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  closeModal();
  render();
  toast('Meal updated.');
}

async function applyWorkout(date) {
  const day = findPlan(date);
  if (!day) return;
  const isWorkout = $('workoutIsToday')?.checked || false;
  const time = $('workoutTime')?.value || '18:30';
  const type = $('workoutType')?.value || 'Strength';
  day.workout = { ...(day.workout || {}), isWorkout, time, type };
  if (isWorkout) {
    const changed = applyPreWorkoutMeal(day);
    day.workout.modifiedMealId = changed?.id || null;
    day.workout.reason = changed ? `${changed.slot} was converted into an easier-digesting pre-workout meal: more carbs/protein and lower fat before training.` : 'No prior meal found to adjust.';
  } else {
    day.workout.reason = '';
  }
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  render();
  if (isWorkout) openModal('Workout meal adjusted', `<div class="stack"><div class="info-box small">${escapeHtml(day.workout.reason)}</div><p class="muted">Daily totals were recalculated by adjusting the rest of the uncompleted meals where possible.</p></div>`);
}

function __legacy_applyPreWorkoutMeal_1_unused(day) {
  const workoutMinutes = timeToMinutes(day.workout.time || '18:30');
  const candidates = day.meals.filter((m) => timeToMinutes(m.time || '00:00') < workoutMinutes && m.status !== 'completed' && m.status !== 'skipped');
  const meal = candidates[candidates.length - 1];
  if (!meal) return null;
  const idx = day.meals.findIndex((m) => m.id === meal.id);
  const originalMacros = calcMealMacros(meal);
  const recipeObj = RECIPE_LIBRARY.find((r) => r.id === 'preworkout_skyr_banana');
  const newMeal = createMealFromRecipe({ ...recipeObj, slot: meal.slot }, day.date);
  const preTarget = {
    calories: originalMacros.calories,
    protein: Math.max(originalMacros.protein, 25),
    carbs: Math.max(originalMacros.carbs, 45),
    fat: Math.min(originalMacros.fat, 8),
  };
  scaleMealsToTarget([newMeal], preTarget, { tolerance: { caloriesPct: 12, protein: 8, carbs: 12, fat: 4 } });
  newMeal.id = meal.id;
  newMeal.time = meal.time;
  newMeal.slot = meal.slot;
  newMeal.status = 'planned';
  newMeal.originalItems = deepClone(meal.originalItems || meal.items);
  newMeal.adjustments = [...(meal.adjustments || []), { at: new Date().toISOString(), type: 'pre_workout', workoutTime: day.workout.time }];
  day.meals[idx] = newMeal;
  const completed = calcDayCompleted(day);
  const fixedMeals = day.meals.filter((m) => m.id === newMeal.id || m.status === 'skipped' || m.status === 'completed');
  const fixedProjected = fixedMeals.filter((m) => m.status !== 'skipped').reduce((acc, m) => addMacros(acc, calcMealMacros(m)), emptyMacros());
  const remainingTarget = subtractMacros(getTargetForDay(day), fixedProjected);
  remainingTarget.calories = Math.max(0, remainingTarget.calories);
  remainingTarget.protein = Math.max(0, remainingTarget.protein);
  remainingTarget.carbs = Math.max(0, remainingTarget.carbs);
  remainingTarget.fat = Math.max(0, remainingTarget.fat);
  const adjustable = day.meals.filter((m) => m.status === 'planned' && m.id !== newMeal.id && !m.locked);
  scaleMealsToTarget(adjustable, remainingTarget);
  return newMeal;
}

function timeToMinutes(time) {
  const [h, m] = String(time || '00:00').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function __legacy_openBaselineReview_1_unused() {
  const raw = $('baselineText')?.value || SAMPLE_BASELINE;
  const parsed = parseBaselineText(raw);
  openModal('Review parsed baseline diet', html`
    <div class="stack">
      <div class="info-box small">Review meal names, foods, quantities, and units. Unknown foods need nutrition values in the Food database.</div>
      ${parsed.map((meal, mi) => `<div class="card flat stack-sm"><h3>${meal.slot}</h3>${meal.items.map((item, ii) => `
        <div class="grid three baseline-row" data-meal-index="${mi}">
          <label class="field"><span>Food</span><input class="baseline-food" value="${escapeHtml(item.rawName || item.foodName)}"></label>
          <label class="field"><span>Quantity</span><input class="baseline-qty" type="number" step="0.1" value="${escapeHtml(item.quantity)}"></label>
          <label class="field"><span>Unit</span><select class="baseline-unit"><option value="g" ${item.unit === 'g' ? 'selected' : ''}>g</option><option value="ml" ${item.unit === 'ml' ? 'selected' : ''}>ml</option><option value="piece" ${item.unit === 'piece' ? 'selected' : ''}>pieces</option></select></label>
        </div>`).join('') || '<p class="muted small">No items parsed.</p>'}</div>`).join('')}
      <button class="primary-button" data-action="save-parsed-baseline">Save baseline</button>
    </div>`);
}

async function __legacy_saveParsedBaseline_1_unused() {
  const raw = $('baselineText')?.value || state.baseline.rawText || SAMPLE_BASELINE;
  const mealCards = [...$('modalBody').querySelectorAll('.card.flat')];
  const meals = mealCards.map((card, i) => {
    const slot = card.querySelector('h3')?.textContent || MEAL_SLOTS[i]?.slot || `Meal ${i + 1}`;
    const rows = [...card.querySelectorAll('.baseline-row')];
    const items = rows.map((row) => {
      const name = row.querySelector('.baseline-food').value.trim();
      const qty = Number(row.querySelector('.baseline-qty').value || 0);
      const unit = row.querySelector('.baseline-unit').value;
      const food = lookupFood(name);
      const normalizedUnit = normalizeUnit(unit, qty, food);
      return {
        id: uuid('item'),
        foodId: food?.id || null,
        foodName: food?.name || name,
        rawName: name,
        quantity: qty,
        unit: normalizedUnit,
        grams: quantityToGrams(qty, normalizedUnit, food),
        originalGrams: quantityToGrams(qty, normalizedUnit, food),
        locked: false,
        notes: '',
        source: food?.source || 'Manual value required',
        confidence: food?.confidence || 'unknown',
      };
    }).filter((item) => item.foodName && item.quantity > 0);
    return { id: uuid('template'), slot, items, notes: '' };
  });
  state.baseline = { id: 'baseline', rawText: raw, meals, updatedAt: new Date().toISOString(), userId: state.activeUserId };
  await idbPut('baseline', state.baseline);
  await loadState();
  closeModal();
  render();
  toast('Baseline diet saved. Regenerate plans to apply it.');
}

function openFoodEditor(foodId = null) {
  const food = foodId ? getFoodById(foodId) : null;
  const f = food || {
    id: '', name: '', aliases: [], defaultUnit: 'g', unitGrams: 100, caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0,
    fiberPer100g: '', sugarPer100g: '', sodiumPer100g: '', department: 'Other', source: 'Manual entry', confidence: 'medium', notes: '', minG: 0, maxG: 1000,
  };
  openModal(food ? 'Edit food' : 'Add custom food', html`
    <div class="stack">
      <div class="form-grid">
        ${foodInput('foodName', 'Name', f.name)}
        ${foodInput('foodAliases', 'Aliases, comma-separated', (f.aliases || []).join(', '))}
        <label class="field"><span>Default unit</span><select id="foodDefaultUnit"><option value="g" ${f.defaultUnit === 'g' ? 'selected' : ''}>g</option><option value="piece" ${f.defaultUnit === 'piece' ? 'selected' : ''}>piece</option><option value="ml" ${f.defaultUnit === 'ml' ? 'selected' : ''}>ml</option></select></label>
        ${foodInput('foodUnitGrams', 'Grams per piece/default unit', f.unitGrams, 'number')}
        ${foodInput('foodCalories', 'Calories per 100g', f.caloriesPer100g, 'number')}
        ${foodInput('foodProtein', 'Protein per 100g', f.proteinPer100g, 'number')}
        ${foodInput('foodCarbs', 'Carbs per 100g', f.carbsPer100g, 'number')}
        ${foodInput('foodFat', 'Fat per 100g', f.fatPer100g, 'number')}
        ${foodInput('foodFiber', 'Optional fiber per 100g', f.fiberPer100g ?? '', 'number')}
        ${foodInput('foodSugar', 'Optional sugar per 100g', f.sugarPer100g ?? '', 'number')}
        ${foodInput('foodSodium', 'Optional sodium per 100g', f.sodiumPer100g ?? '', 'number')}
        <label class="field"><span>Department</span><select id="foodDepartment">${DEPARTMENTS.map((d) => `<option ${f.department === d ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
        <label class="field"><span>Confidence</span><select id="foodConfidence">${['high', 'medium', 'low', 'unknown'].map((d) => `<option ${f.confidence === d ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
        ${foodInput('foodMinG', 'Minimum practical grams', f.minG ?? 0, 'number')}
        ${foodInput('foodMaxG', 'Maximum practical grams', f.maxG ?? 1000, 'number')}
      </div>
      <label class="field"><span>Source</span><input id="foodSource" value="${escapeHtml(f.source || '')}"></label>
      <label class="field"><span>Notes</span><textarea id="foodNotes">${escapeHtml(f.notes || '')}</textarea></label>
      <div class="actions">
        <button class="primary-button" data-action="save-food" data-food-id="${food?.id || ''}">Save food</button>
        ${food ? `<button class="danger-button" data-action="delete-food" data-food-id="${food.id}">Delete</button>` : ''}
      </div>
    </div>`);
}

function foodInput(id, label, value, type = 'text') {
  return `<label class="field"><span>${label}</span><input id="${id}" type="${type}" step="0.1" value="${escapeHtml(value ?? '')}"></label>`;
}

async function saveFood(foodId = null) {
  const id = foodId || uuid('food');
  const n = (id) => {
    const value = $(id)?.value;
    return value === '' ? null : Number(value);
  };
  const food = {
    id,
    name: $('foodName').value.trim(),
    aliases: $('foodAliases').value.split(',').map((s) => s.trim()).filter(Boolean),
    defaultUnit: $('foodDefaultUnit').value,
    unitGrams: n('foodUnitGrams') || 100,
    caloriesPer100g: n('foodCalories') || 0,
    proteinPer100g: n('foodProtein') || 0,
    carbsPer100g: n('foodCarbs') || 0,
    fatPer100g: n('foodFat') || 0,
    fiberPer100g: n('foodFiber'),
    sugarPer100g: n('foodSugar'),
    sodiumPer100g: n('foodSodium'),
    department: $('foodDepartment').value,
    source: $('foodSource').value.trim() || 'Manual entry',
    sourceProvider: 'manual',
    sourceId: id,
    sourceUrl: '',
    displayNameEn: $('foodName').value.trim(),
    displayNameIt: $('foodName').value.trim(),
    category: $('foodDepartment').value,
    rawOrCookedState: inferFoodState($('foodName').value.trim()),
    importedAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    confidence: $('foodConfidence').value,
    lastUpdated: new Date().toISOString(),
    notes: $('foodNotes').value.trim(),
    userEdited: true,
    userId: state.activeUserId,
    minG: n('foodMinG') ?? 0,
    maxG: n('foodMaxG') ?? 1000,
  };
  if (!food.name) { toast('Food name is required.'); return; }
  await idbPut('foods', food);
  if (isCloudSessionActive()) {
    apiRequest('/api/nutrition/custom-foods', { method: 'POST', body: food }).catch((error) => console.warn('Custom food cloud save failed:', error.message));
  }
  await loadState();
  closeModal();
  render();
  toast('Food saved.');
}

function openFoodLookup() {
  openDetailPanel(tr('lookup.title'), html`
    <div class="stack">
      <div class="info-box small">${tr('settings.nutrition.providerHooks')} ${tr('settings.nutrition.noUserKeys')}</div>
      <div class="form-grid two">
        <label class="field"><span>${tr('lookup.search')}</span><input id="lookupQuery" placeholder="Example: skyr plain, bresaola, rice cakes"></label>
        <label class="field"><span>${tr('lookup.provider')}</span><select id="lookupProvider"><option value="auto">${tr('lookup.auto')}</option><option value="local">${tr('lookup.localOnly')}</option><option value="curated_seed">${tr('settings.nutrition.curated')}</option><option value="usda_fdc">${tr('lookup.usda')}</option><option value="open_food_facts">${tr('lookup.off')}</option></select></label>
      </div>
      <button class="primary-button" data-action="perform-food-lookup">${tr('lookup.searchButton')}</button>
      <div id="lookupResults" class="stack-sm"></div>
    </div>`);
}

async function performFoodLookup() {
  const query = $('lookupQuery')?.value.trim();
  const provider = $('lookupProvider')?.value || 'auto';
  const box = $('lookupResults');
  if (!query) return;
  box.innerHTML = '<p class="muted small">Searching Diet Planner Cloud…</p>';
  try {
    const params = new URLSearchParams({ q: query });
    if (provider && provider !== 'auto' && provider !== 'local') params.set('provider', provider);
    const payload = await apiRequest(`/api/nutrition/search?${params.toString()}`);
    state.lookupResults = dedupeLookupResults(payload.results || []).slice(0, 12);
    await lookupCachePut(query, provider, state.lookupResults);
    renderLookupResults(box);
  } catch (error) {
    const cached = await lookupCacheGet(query, provider);
    if (cached?.results?.length) {
      state.lookupResults = cached.results;
      renderLookupResults(box);
      return;
    }
    if (provider === 'auto' || provider === 'local') {
      state.lookupResults = searchLocalFoods(query).slice(0, 12);
      renderLookupResults(box);
      if (!state.lookupResults.length) box.innerHTML = `<div class="warning-box small">${tr('lookup.noResults')} ${escapeHtml(error.message)}</div>`;
      return;
    }
    box.innerHTML = `<div class="warning-box small">Lookup failed or Diet Planner Cloud is offline. Add food manually instead. ${escapeHtml(error.message)}</div>`;
  }
}

async function hydrateLookupFood(result) {
  if (!result?.sourceProvider || !result?.sourceId) return result;
  if (['manual', 'curated_seed'].includes(result.sourceProvider) && !isCloudSessionActive()) return result;
  try {
    const provider = encodeURIComponent(result.sourceProvider);
    const id = encodeURIComponent(result.sourceId);
    const payload = await apiRequest(`/api/nutrition/food/${provider}/${id}`);
    return payload?.food || result;
  } catch {
    return result;
  }
}

function searchLocalFoods(query) {
  const q = normalizeText(query);
  return state.foods.filter((f) => [f.name, f.displayNameEn, f.displayNameIt, ...(f.aliases || [])].some((name) => normalizeText(name).includes(q))).map((f) => ({
    id: f.id,
    name: localizedFoodName(f),
    brand: 'Local database',
    caloriesPer100g: Number(f.caloriesPer100g) || 0,
    proteinPer100g: Number(f.proteinPer100g) || 0,
    carbsPer100g: Number(f.carbsPer100g) || 0,
    fatPer100g: Number(f.fatPer100g) || 0,
    fiberPer100g: f.fiberPer100g,
    sugarPer100g: f.sugarPer100g,
    sodiumPer100g: f.sodiumPer100g,
    sourceProvider: f.sourceProvider || 'curated_seed',
    sourceId: f.sourceId || f.id,
    sourceUrl: f.sourceUrl || '',
    confidence: f.confidence || 'medium',
    department: f.department || 'Other',
    rawOrCookedState: f.rawOrCookedState || 'as_sold_or_raw',
    aliases: f.aliases || [],
  }));
}

function dedupeLookupResults(results) {
  const seen = new Set();
  return results.filter((r) => {
    const key = normalizeText(`${r.sourceProvider}:${r.sourceId || r.name}:${r.brand || ''}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderLookupResults(box) {
  box.innerHTML = state.lookupResults.length ? state.lookupResults.map((r, i) => `<div class="card flat stack-sm"><strong>${escapeHtml(r.name)}</strong><div class="small muted">${escapeHtml(r.brand || 'No brand')} · ${escapeHtml(r.sourceProvider || 'provider')} · ${round(r.caloriesPer100g)} kcal · P ${round(r.proteinPer100g, 1)} C ${round(r.carbsPer100g, 1)} F ${round(r.fatPer100g, 1)}</div><div>${confidencePill(r.confidence || 'unknown')}</div><button class="secondary-button" data-action="import-lookup-food" data-index="${i}">${tr('lookup.import')}</button></div>`).join('') : `<div class="warning-box small">${tr('lookup.noResults')}</div>`;
}

async function lookupCacheGet(query, provider) {
  return idbGet('nutritionLookupCache', `${provider}:${normalizeText(query)}`).catch(() => null);
}

async function lookupCachePut(query, provider, results) {
  if (!results?.length) return;
  await idbPut('nutritionLookupCache', { id: `${provider}:${normalizeText(query)}`, query, provider, results, createdAt: new Date().toISOString(), userId: state.activeUserId });
}

async function importLookupFood(index) {
  let r = state.lookupResults[Number(index)];
  if (!r) return;
  r = await hydrateLookupFood(r);
  const food = normalizeFoodRecord({
    id: r.sourceProvider === 'curated_seed' && r.id ? r.id : uuid('food'),
    name: r.name,
    displayNameEn: r.name,
    displayNameIt: r.name,
    aliases: r.aliases || (r.brand ? [r.brand] : []),
    defaultUnit: 'g',
    unitGrams: 100,
    gramsPerUnit: 100,
    caloriesPer100g: r.caloriesPer100g,
    proteinPer100g: r.proteinPer100g,
    carbsPer100g: r.carbsPer100g,
    fatPer100g: r.fatPer100g,
    fiberPer100g: r.fiberPer100g,
    sugarPer100g: r.sugarPer100g,
    sodiumPer100g: r.sodiumPer100g,
    department: r.department || 'Other',
    category: r.department || 'Other',
    source: r.sourceProvider,
    sourceProvider: r.sourceProvider,
    sourceId: r.sourceId,
    sourceUrl: r.sourceUrl,
    confidence: r.confidence || 'medium',
    rawOrCookedState: r.rawOrCookedState || 'as_listed_by_provider',
    importedAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    notes: 'Imported from provider lookup. Verify against package label and raw/cooked state.',
    userEdited: false,
    minG: 0,
    maxG: 1000,
    userId: state.activeUserId,
  });
  await idbPut('foods', food);
  await loadState();
  closeModal();
  render();
  toast('Food imported to local database.');
}

async function importOffFood(index) {
  await importLookupFood(index);
}

async function __legacy_regenerateDay_1_unused(date) {
  const lunchMode = state.settings.lunchMode;
  let lunchOverride = null;
  if (lunchMode === 'rotating') lunchOverride = RECIPE_LIBRARY.filter((r) => r.slot === 'Lunch')[0];
  const day = makeDayPlan(date, lunchOverride);
  scaleDayToTarget(day, getTargetForDay(day));
  await idbPut('plans', day);
  await loadState();
  render();
  toast('Day regenerated.');
}

function viewDay(date) {
  const day = findPlan(date);
  if (!day) return;
  openModal(formatDate(date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), html`
    <div class="stack">
      <div class="card flat stack-sm"><h3>Daily totals</h3><div>${totalsText(calcDayProjected(day))}</div>${macroDiffHtml(calcDayProjected(day), getTargetForDay(day))}</div>
      ${day.meals.map((meal) => `<div class="card flat stack-sm"><h3>${escapeHtml(meal.slot)} · ${escapeHtml(meal.recipeName || '')}</h3><ul>${meal.items.map((i) => `<li>${escapeHtml(i.foodName)} — ${displayQuantity(i)}</li>`).join('')}</ul><div class="macro-pills"><span class="macro-pill">${totalsText(calcMealMacros(meal))}</span></div></div>`).join('')}
    </div>`);
}

async function saveBodyEntry() {
  const fields = ['date', 'bodyWeight', 'bodyFatPct', 'fatMass', 'leanMass', 'muscleMass', 'skeletalMuscleMass', 'visceralFat', 'waterPct', 'bmi', 'bmr', 'waist', 'chest', 'arm', 'leg'];
  const entry = { id: uuid('body'), createdAt: new Date().toISOString() };
  for (const key of fields) {
    const value = $(`body_${key}`)?.value;
    entry[key] = key === 'date' ? value : value === '' ? '' : Number(value);
  }
  entry.notes = $('body_notes')?.value || '';
  if (!entry.date) { toast('Date is required.'); return; }
  await idbPut('body', entry);
  await loadState();
  render();
  toast('Body entry saved.');
}

async function parseAndReviewBlood() {
  const date = $('bloodDate').value;
  const notes = $('bloodNotes').value;
  const originalText = $('bloodText').value;
  const markers = parseBloodMarkers(originalText);
  openModal('Review blood markers', html`
    <div class="stack">
      <div class="warning-box small">Review parsed values carefully. The parser is heuristic.</div>
      ${markers.length ? `<div class="table-wrap"><table><thead><tr><th>Marker</th><th>Value</th><th>Unit</th><th>Reference range</th><th>Flag</th></tr></thead><tbody>${markers.map((m) => `<tr class="blood-marker-row"><td><input class="blood-name" value="${escapeHtml(m.name)}"></td><td><input class="blood-value" type="number" step="0.01" value="${m.value}"></td><td><input class="blood-unit" value="${escapeHtml(m.unit || '')}"></td><td><input class="blood-range" value="${escapeHtml(m.referenceRange || '')}"></td><td><select class="blood-flag"><option ${m.flag === 'unknown' ? 'selected' : ''}>unknown</option><option ${m.flag === 'normal' ? 'selected' : ''}>normal</option><option ${m.flag === 'low' ? 'selected' : ''}>low</option><option ${m.flag === 'high' ? 'selected' : ''}>high</option></select></td></tr>`).join('')}</tbody></table></div>` : '<div class="warning-box small">No known markers were parsed. You can still save the original text as an archive.</div>'}
      <button class="primary-button" data-action="save-blood-exam" data-date="${date}" data-notes="${escapeHtml(notes)}">Save exam</button>
    </div>`);
  $('modalBody').dataset.originalText = originalText;
}

async function saveBloodExamFromModal(button) {
  const rows = [...document.querySelectorAll('.blood-marker-row')];
  const markers = rows.map((row) => ({
    id: uuid('marker'),
    name: row.querySelector('.blood-name').value.trim(),
    value: Number(row.querySelector('.blood-value').value || 0),
    unit: row.querySelector('.blood-unit').value.trim(),
    referenceRange: row.querySelector('.blood-range').value.trim(),
    flag: row.querySelector('.blood-flag').value,
    notes: '',
  })).filter((m) => m.name);
  const exam = {
    id: uuid('exam'),
    date: button.dataset.date || todayISO(),
    notes: button.dataset.notes || '',
    originalText: $('modalBody').dataset.originalText || '',
    markers,
    createdAt: new Date().toISOString(),
  };
  await idbPut('blood', exam);
  await loadState();
  closeModal();
  render();
  toast('Blood exam saved.');
}

async function exportJson() {
  const payload = {
    app: 'Diet Planner',
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    stores: {},
  };
  for (const store of STORES) payload.stores[store] = await idbGetAll(store);
  downloadFile(`diet-planner-backup-${todayISO()}.json`, JSON.stringify(payload, null, 2), 'application/json');
}

async function importJson(file) {
  const text = await file.text();
  const payload = JSON.parse(text);
  if (!payload.stores) throw new Error('Invalid backup file.');
  for (const store of STORES) {
    await idbClear(store);
    for (const record of payload.stores[store] || []) await idbPut(store, record);
  }
  await loadState();
  render();
  toast('Backup imported.');
}

function exportCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  downloadFile(filename, csv, 'text/csv');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportFoodsCsv() {
  const rows = [['id', 'name', 'aliases', 'calories_per_100g', 'protein_per_100g', 'carbs_per_100g', 'fat_per_100g', 'source', 'confidence', 'user_edited']];
  for (const f of state.foods) rows.push([f.id, f.name, (f.aliases || []).join('|'), f.caloriesPer100g, f.proteinPer100g, f.carbsPer100g, f.fatPer100g, f.source, f.confidence, f.userEdited]);
  exportCsv(`diet-planner-foods-${todayISO()}.csv`, rows);
}

function exportBodyCsv() {
  const keys = ['date', 'bodyWeight', 'bodyFatPct', 'fatMass', 'leanMass', 'muscleMass', 'skeletalMuscleMass', 'visceralFat', 'waterPct', 'bmi', 'bmr', 'waist', 'chest', 'arm', 'leg', 'notes'];
  const rows = [keys];
  for (const e of state.bodyEntries) rows.push(keys.map((k) => e[k] ?? ''));
  exportCsv(`diet-planner-body-${todayISO()}.csv`, rows);
}

function exportBloodCsv() {
  const rows = [['exam_date', 'marker', 'value', 'unit', 'reference_range', 'flag', 'notes']];
  for (const exam of state.bloodExams) for (const m of exam.markers) rows.push([exam.date, m.name, m.value, m.unit, m.referenceRange, m.flag, m.notes || exam.notes || '']);
  exportCsv(`diet-planner-blood-${todayISO()}.csv`, rows);
}

function setupEvents() {
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'cloud-login') { await cloudLoginFromForm(); return; }
    if (action === 'create-profile') { await createLocalProfileFromForm(); return; }
    if (action === 'login-profile') { await loginProfile(button.dataset.profileId); return; }
    if (action === 'logout-profile') { await logoutProfile(); return; }
    if (action === 'open-macro-detail') { const day = findPlan(todayISO()); if (day) openDetailPanel(tr('macro.dailyTarget'), renderMacroDetail(day)); return; }
    if (action === 'open-progress-detail') { const day = findPlan(todayISO()); if (day) openDetailPanel(tr('progress.title'), renderProgressDetail(day)); return; }
    if (action === 'open-workout-detail') { const day = findPlan(todayISO()); if (day) openDetailPanel(tr('dashboard.workoutSummary'), renderWorkoutDetail(day)); return; }
    if (action === 'open-grocery-detail') { const day = findPlan(todayISO()); if (day) openDetailPanel(tr('dashboard.grocerySummary'), renderGroceryDetail(day)); return; }
    if (action === 'open-prep-detail') { const day = findPlan(todayISO()); if (day) openDetailPanel(tr('dashboard.mealPrepSummary'), renderPrepDetail(day)); return; }
    if (action === 'open-meal-detail') { if (event.target.closest('button, a, input, select, textarea')) return; openMealDetail(button.dataset.date, button.dataset.mealId); return; }
    if (action === 'nav') setView(button.dataset.view);
    if (action === 'toggle-meal') await toggleMeal(button.dataset.date, button.dataset.mealId);
    if (action === 'complete-meal') await setMealStatus(button.dataset.date, button.dataset.mealId, 'completed');
    if (action === 'skip-meal') askSkipMeal(button.dataset.date, button.dataset.mealId);
    if (action === 'confirm-skip-recalc') await skipAndRecalculate(button.dataset.date, button.dataset.mealId, true);
    if (action === 'confirm-skip-only') await skipAndRecalculate(button.dataset.date, button.dataset.mealId, false);
    if (action === 'change-recipe') await changeRecipe(button.dataset.date, button.dataset.mealId);
    if (action === 'edit-meal') openMealEditor(button.dataset.date, button.dataset.mealId);
    if (action === 'add-meal-item-row') $('editMealItems').insertAdjacentHTML('beforeend', renderEditMealItem());
    if (action === 'save-meal-edit') await saveMealEdit(button.dataset.date, button.dataset.mealId);
    if (action === 'apply-workout') await applyWorkout(button.dataset.date);
    if (action === 'generate-week' || action === 'generate-week-from-form') {
      const start = action === 'generate-week-from-form' ? $('weekStart').value : button.dataset.start;
      const end = action === 'generate-week-from-form' ? $('weekEnd').value : button.dataset.end;
      const include = action === 'generate-week-from-form' ? $('weekIncludeWeekends').checked : button.dataset.weekends === 'true';
      const lunchMode = action === 'generate-week-from-form' ? $('weekLunchMode').value : state.settings.lunchMode;
      await saveSettings({ includeWeekends: include, lunchMode });
      await generatePlans(start, end, include, lunchMode);
    }
    if (action === 'regenerate-day') await regenerateDay(button.dataset.date);
    if (action === 'view-day') viewDay(button.dataset.date);
    if (action === 'update-grocery-range') {
      localStorage.setItem('grocery.start', $('groceryStart').value);
      localStorage.setItem('grocery.end', $('groceryEnd').value);
      localStorage.setItem('grocery.slots', JSON.stringify([...document.querySelectorAll('.grocery-slot:checked')].map((x) => x.value)));
      render();
    }
    if (action === 'toggle-shopping') localStorage.setItem(`shopping.checked.${button.dataset.key}`, button.checked ? 'true' : 'false');
    if (action === 'update-prep-range') {
      localStorage.setItem('prep.start', $('prepStart').value);
      localStorage.setItem('prep.end', $('prepEnd').value);
      render();
    }
    if (action === 'save-body-entry') await saveBodyEntry();
    if (action === 'delete-body') { await idbDelete('body', button.dataset.id); await loadState(); render(); }
    if (action === 'parse-blood') await parseAndReviewBlood();
    if (action === 'save-blood-exam') await saveBloodExamFromModal(button);
    if (action === 'delete-blood') { await idbDelete('blood', button.dataset.id); await loadState(); render(); }
    if (action === 'open-target-editor') { setView('settings'); setTimeout(() => $('macroSettingsCard')?.scrollIntoView({ behavior: 'smooth' }), 50); }
    if (action === 'open-baseline-editor') { setView('settings'); setTimeout(() => $('baselineSettingsCard')?.scrollIntoView({ behavior: 'smooth' }), 50); }
    if (action === 'save-target') { await saveTarget(readMacroForm()); await loadState(); render(); toast('Macro targets saved. Regenerate plans to apply them.'); }
    if (action === 'save-preferences') await savePreferencesFromForm();
    if (action === 'parse-baseline') openBaselineReview();
    if (action === 'save-parsed-baseline') await saveParsedBaseline();
    if (action === 'reset-sample-baseline') { $('baselineText').value = SAMPLE_BASELINE; }
    if (action === 'open-food-editor') openFoodEditor(button.dataset.foodId || null);
    if (action === 'save-food') await saveFood(button.dataset.foodId || null);
    if (action === 'delete-food') { await idbDelete('foods', button.dataset.foodId); await loadState(); closeModal(); render(); toast('Food deleted.'); }
    if (action === 'open-food-lookup') openFoodLookup();
    if (action === 'perform-food-lookup') await performFoodLookup();
    if (action === 'import-off-food') await importOffFood(button.dataset.index);
    if (action === 'import-lookup-food') await importLookupFood(button.dataset.index);
    if (action === 'export-json') await exportJson();
    if (action === 'export-food-csv') exportFoodsCsv();
    if (action === 'export-body-csv') exportBodyCsv();
    if (action === 'export-blood-csv') exportBloodCsv();
  });

  $('modalClose').addEventListener('click', closeModal);
  $('modal').addEventListener('click', (event) => { if (event.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !$('modal').hidden) closeModal(); });
  document.addEventListener('change', async (event) => {
    if (event.target.id === 'importJson' && event.target.files?.[0]) {
      try { await importJson(event.target.files[0]); } catch (error) { toast(`Import failed: ${error.message}`); }
    }
    if (event.target.classList.contains('grocery-slot')) {
      localStorage.setItem('grocery.slots', JSON.stringify([...document.querySelectorAll('.grocery-slot:checked')].map((x) => x.value)));
      render();
    }
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    const btn = $('installButton');
    btn.hidden = false;
    btn.onclick = async () => {
      btn.hidden = true;
      state.deferredInstallPrompt.prompt();
      await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
    };
  });
}

async function __legacy_savePreferencesFromForm_1_unused() {
  const settings = {
    prepDay: $('pref_prepDay').value,
    lunchMode: $('pref_lunchMode').value,
    units: $('pref_units').value,
    language: $('pref_language').value,
    theme: $('pref_theme').value,
    likedFoods: $('pref_likedFoods').value,
    dislikedFoods: $('pref_dislikedFoods').value,
    excludedFoods: $('pref_excludedFoods').value,
    allergies: $('pref_allergies').value,
    preferredProtein: $('pref_preferredProtein').value,
    preferredCarbs: $('pref_preferredCarbs').value,
    preferredFats: $('pref_preferredFats').value,
  };
  await saveSettings(settings);
  await loadState();
  renderNav();
  render();
  toast('Preferences saved.');
}


/* Iteration 0.3 premium settings, recipes, provider architecture, and deployment layer */
function normalizedMealSlot(value) {
  const clean = normalizeText(value);
  if (clean.includes('colazione') || clean.includes('breakfast')) return 'Breakfast';
  if (clean.includes('spuntino 1') || clean.includes('snack 1')) return 'Snack 1';
  if (clean.includes('spuntino 2') || clean.includes('snack 2')) return 'Snack 2';
  if (clean.includes('pranzo') || clean.includes('lunch')) return 'Lunch';
  if (clean.includes('cena') || clean.includes('dinner')) return 'Dinner';
  return MEAL_SLOTS.some((m) => m.slot === value) ? value : 'Lunch';
}

function normalizeRecipeIngredient(ingredient) {
  if (Array.isArray(ingredient)) {
    const [foodId, quantity, unit] = ingredient;
    const food = getFoodById(foodId);
    const normalizedUnit = normalizeUnit(unit, quantity, food);
    return {
      foodId,
      name: food?.name || foodId,
      quantity: Number(quantity) || 0,
      unit: normalizedUnit,
      grams: quantityToGrams(quantity, normalizedUnit, food),
      notes: '',
      optional: false,
    };
  }
  const name = ingredient.name || ingredient.foodName || ingredient.rawName || ingredient.foodId || '';
  const food = ingredient.foodId ? getFoodById(ingredient.foodId) : lookupFood(name);
  const quantity = Number(ingredient.quantity ?? ingredient.qty ?? ingredient.grams ?? 0) || 0;
  const unit = normalizeUnit(ingredient.unit || (quantity > 15 ? 'g' : 'piece'), quantity, food);
  const grams = Number(ingredient.grams) || quantityToGrams(quantity, unit, food);
  return {
    foodId: ingredient.foodId || food?.id || null,
    name: food?.name || name,
    quantity,
    unit,
    grams,
    notes: ingredient.notes || '',
    optional: Boolean(ingredient.optional),
  };
}

function normalizeRecipeRecord(recipeRecord = {}) {
  const slot = normalizedMealSlot(recipeRecord.mealType || recipeRecord.slot || 'Lunch');
  const now = new Date().toISOString();
  const ingredients = (recipeRecord.ingredients || []).map(normalizeRecipeIngredient);
  const instructions = recipeRecord.instructions || recipeRecord.steps || [];
  const name = recipeRecord.name || recipeRecord.displayNameEn || `${slot} recipe`;
  const normalized = {
    id: recipeRecord.id || uuid('recipe'),
    userId: recipeRecord.userId ?? state.activeUserId ?? null,
    name,
    displayNameEn: recipeRecord.displayNameEn || name,
    displayNameIt: recipeRecord.displayNameIt || name,
    mealType: slot,
    slot,
    tags: recipeRecord.tags || [],
    servings: Number(recipeRecord.servings) || 1,
    ingredients,
    instructions,
    steps: instructions,
    prepTimeMinutes: Number(recipeRecord.prepTimeMinutes ?? recipeRecord.prepMinutes ?? 0) || 0,
    prepMinutes: Number(recipeRecord.prepTimeMinutes ?? recipeRecord.prepMinutes ?? 0) || 0,
    cookTimeMinutes: Number(recipeRecord.cookTimeMinutes ?? recipeRecord.cookMinutes ?? 0) || 0,
    cookMinutes: Number(recipeRecord.cookTimeMinutes ?? recipeRecord.cookMinutes ?? 0) || 0,
    notes: recipeRecord.notes || recipeRecord.storageNotes || '',
    storageNotes: recipeRecord.storageNotes || recipeRecord.notes || '',
    alternatives: recipeRecord.alternatives || [],
    nutritionPerServing: recipeRecord.nutritionPerServing || null,
    confidence: recipeRecord.confidence || 'medium',
    source: recipeRecord.source || 'seed_recipe',
    createdAt: recipeRecord.createdAt || now,
    updatedAt: recipeRecord.updatedAt || now,
  };
  normalized.nutritionPerServing = normalized.nutritionPerServing || calcRecipeMacros(normalized);
  return normalized;
}

function recipeDisplayName(recipeRecord) {
  return normalizeLanguage(state.settings?.language) === 'it' ? (recipeRecord.displayNameIt || recipeRecord.name) : (recipeRecord.displayNameEn || recipeRecord.name);
}

function recipeIngredients(recipeRecord) {
  return (recipeRecord.ingredients || []).map(normalizeRecipeIngredient);
}

function calcRecipeMacros(recipeRecord) {
  const ingredients = recipeIngredients(recipeRecord);
  const total = ingredients.reduce((acc, ingredient) => {
    const item = createItemFromIngredient(ingredient);
    return addMacros(acc, calcItemMacros(item));
  }, emptyMacros());
  const servings = Math.max(1, Number(recipeRecord.servings) || 1);
  return {
    calories: total.calories / servings,
    protein: total.protein / servings,
    carbs: total.carbs / servings,
    fat: total.fat / servings,
    fiber: total.fiber / servings,
    sugar: total.sugar / servings,
    sodium: total.sodium / servings,
  };
}

function createItemFromIngredient(ingredient) {
  const food = ingredient.foodId ? getFoodById(ingredient.foodId) : lookupFood(ingredient.name);
  const quantity = Number(ingredient.quantity) || 0;
  const unit = normalizeUnit(ingredient.unit, quantity, food);
  const grams = Number(ingredient.grams) || quantityToGrams(quantity, unit, food);
  return {
    id: uuid('item'),
    foodId: food?.id || ingredient.foodId || null,
    foodName: food?.name || ingredient.name || '',
    rawName: ingredient.name || food?.name || '',
    quantity,
    unit: unit === 'kg' ? 'g' : unit === 'l' ? 'ml' : unit,
    grams,
    originalGrams: grams,
    locked: false,
    notes: ingredient.notes || '',
    source: food?.source || 'Manual value required',
    confidence: food?.confidence || 'unknown',
  };
}

function getAllRecipes() {
  const recipes = state.recipes?.length ? state.recipes : RECIPE_LIBRARY.map(normalizeRecipeRecord);
  return recipes.map(normalizeRecipeRecord).sort((a, b) => mealLabel(a.mealType).localeCompare(mealLabel(b.mealType)) || recipeDisplayName(a).localeCompare(recipeDisplayName(b)));
}

function getRecipeById(id) {
  return getAllRecipes().find((recipeRecord) => recipeRecord.id === id) || null;
}

async function ensureSeedRecipes() {
  if (!state.db.objectStoreNames.contains('recipes')) return;
  const existing = await idbGetAll('recipes').catch(() => []);
  const byId = new Map(existing.map((recipeRecord) => [recipeRecord.id, recipeRecord]));
  for (const seed of RECIPE_LIBRARY.map((recipeRecord) => normalizeRecipeRecord({ ...recipeRecord, userId: null, source: 'seed_recipe' }))) {
    const current = byId.get(seed.id);
    if (!current) await idbPut('recipes', seed);
    else if (current.source === 'seed_recipe') await idbPut('recipes', { ...seed, ...current, ingredients: (current.ingredients || seed.ingredients).map(normalizeRecipeIngredient) });
  }
}

async function seedIfNeeded() {
  const existingSettings = await idbGet('settings', 'settings');
  const profiles = await idbGetAll('profiles');
  const freshInstall = !existingSettings && profiles.length === 0;
  if (!existingSettings) await idbPut('settings', normalizeSettingsRecord(DEFAULT_SETTINGS));
  if (!(await idbGet('macroTargets', 'default'))) await idbPut('macroTargets', { ...DEFAULT_TARGET });
  await ensureSeedFoods();
  state.foods = (await idbGetAll('foods')).map(normalizeFoodRecord);
  await ensureSeedRecipes();
  await ensureNutritionProviders();
  if (!(await idbGet('baseline', 'baseline'))) {
    const parsed = parseBaselineText(SAMPLE_BASELINE);
    await idbPut('baseline', { id: 'baseline', rawText: SAMPLE_BASELINE, meals: parsed, updatedAt: new Date().toISOString(), userId: null });
  }
  if (!freshInstall && profiles.length === 0) await migrateLegacyProfile();
}

async function ensureNutritionProviders() {
  if (!state.db.objectStoreNames.contains('nutritionProviders')) return;
  const existing = await idbGetAll('nutritionProviders').catch(() => []);
  const byId = new Map(existing.map((provider) => [provider.id, provider]));
  for (const provider of NUTRITION_PROVIDERS) {
    await idbPut('nutritionProviders', { ...provider, ...(byId.get(provider.id) || {}), updatedAt: new Date().toISOString() });
  }
}

async function loadState() {
  state.profiles = (await idbGetAll('profiles')).sort((a, b) => String(a.displayName || '').localeCompare(String(b.displayName || '')));
  const session = getActiveSession();
  state.activeProfile = state.profiles.find((p) => p.id === session?.userId) || null;
  state.activeUserId = state.activeProfile?.id || null;
  state.needsOnboarding = !state.activeProfile;
  state.settings = normalizeSettingsRecord((await idbGet('settings', 'settings')) || DEFAULT_SETTINGS);
  if (state.activeProfile) {
    state.settings.language = normalizeLanguage(state.activeProfile.language || state.settings.language);
    state.settings.theme = state.activeProfile.theme || state.settings.theme || 'system';
    state.settings.units = state.activeProfile.units || state.settings.units || 'metric';
  }
  state.target = (await idbGet('macroTargets', 'default')) || DEFAULT_TARGET;
  state.foods = (await idbGetAll('foods')).map(normalizeFoodRecord).filter((f) => !f.userId || !state.activeUserId || f.userId === state.activeUserId).sort((a, b) => localizedFoodName(a).localeCompare(localizedFoodName(b)));
  state.recipes = (await idbGetAll('recipes').catch(() => [])).map(normalizeRecipeRecord).filter((recipeRecord) => !recipeRecord.userId || !state.activeUserId || recipeRecord.userId === state.activeUserId);
  state.nutritionProviders = await idbGetAll('nutritionProviders').catch(() => []);
  await refreshNutritionProviders();
  state.baseline = (await idbGet('baseline', 'baseline')) || { id: 'baseline', rawText: SAMPLE_BASELINE, meals: parseBaselineText(SAMPLE_BASELINE), userId: state.activeUserId };
  state.plans = (await idbGetAll('plans')).filter((p) => !p.userId || !state.activeUserId || p.userId === state.activeUserId).sort(sortByDate);
  state.bodyEntries = (await idbGetAll('body')).filter((p) => !p.userId || !state.activeUserId || p.userId === state.activeUserId).sort(sortByDate);
  state.bloodExams = (await idbGetAll('blood')).filter((p) => !p.userId || !state.activeUserId || p.userId === state.activeUserId).sort(sortByDate);
  applyLanguageAndTheme();
}

function createMealFromRecipe(recipeObj, date) {
  const normalized = normalizeRecipeRecord(recipeObj);
  const items = recipeIngredients(normalized).map(createItemFromIngredient).filter((item) => item.foodName && item.quantity > 0);
  const meal = {
    id: uuid('meal'),
    date,
    slot: normalized.mealType,
    time: state.settings.mealTimes?.[normalized.mealType] || MEAL_SLOTS.find((m) => m.slot === normalized.mealType)?.time || '12:00',
    status: 'planned',
    locked: false,
    recipeId: normalized.id,
    recipeName: recipeDisplayName(normalized),
    instructions: normalized.instructions,
    prepMinutes: normalized.prepTimeMinutes,
    cookMinutes: normalized.cookTimeMinutes,
    storageNotes: normalized.storageNotes || normalized.notes,
    alternatives: normalized.alternatives || [],
    originalItems: deepClone(items),
    items,
    notes: normalized.notes || '',
    source: normalized.source || 'recipe_library',
    adjustments: [],
  };
  meal.originalMacros = calcMealMacros(meal);
  return meal;
}

function makeDayPlan(date, lunchOverride = null) {
  const templates = state.baseline?.meals?.length ? state.baseline.meals : parseBaselineText(SAMPLE_BASELINE);
  const meals = MEAL_SLOTS.map(({ slot }) => {
    if (slot === 'Lunch' && lunchOverride) return createMealFromRecipe(lunchOverride, date);
    const template = templates.find((m) => m.slot === slot) || { slot, items: [] };
    return createMealFromTemplate(template, date);
  });
  return {
    date,
    userId: state.activeUserId,
    dayName: formatDate(date, { weekday: 'long' }),
    meals,
    workout: { isWorkout: false, time: '18:30', type: 'Strength', modifiedMealId: null, reason: '' },
    notes: '',
    generatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    recalculationLog: [],
  };
}

async function generatePlans(start, end, includeWeekends, lunchMode = state.settings.lunchMode) {
  const dates = eachDate(start, end, includeWeekends);
  const lunchRecipes = getAllRecipes().filter((recipeRecord) => recipeRecord.mealType === 'Lunch');
  const created = [];
  for (let i = 0; i < dates.length; i += 1) {
    let lunchOverride = null;
    if (lunchMode === 'rotating' && lunchRecipes.length) {
      const pattern = [0, 0, 1, 1, 2];
      lunchOverride = lunchRecipes[pattern[i % pattern.length] % lunchRecipes.length];
    }
    const day = makeDayPlan(dates[i], lunchOverride);
    scaleDayToTarget(day, getTargetForDay(day));
    await idbPut('plans', day);
    created.push(day);
  }
  await loadState();
  toast(`Generated ${created.length} day plan${created.length === 1 ? '' : 's'}.`);
  render();
}

function renderSettings() {
  const profileName = state.activeProfile?.displayName || 'Local User';
  const emailStatus = state.activeProfile?.email || tr('settings.profile.emailStatus.none');
  const baselineSummary = summarizeBaseline(state.baseline?.rawText || '');
  const enabledProviders = (state.nutritionProviders || []).filter((provider) => provider.enabled).length;
  return html`
    <div class="settings-premium stack">
      <section class="settings-hero card flat stack-sm">
        <div>
          <h2>${tr('nav.settings')}</h2>
          <p class="muted small">${tr('settings.subtitle')}</p>
        </div>
        <div class="settings-quick-actions">
          <label class="mui-control"><span>${tr('settings.language')}</span><select id="settingsLanguageQuick"><option value="en" ${normalizeLanguage(state.settings.language) === 'en' ? 'selected' : ''}>English</option><option value="it" ${normalizeLanguage(state.settings.language) === 'it' ? 'selected' : ''}>Italiano</option></select></label>
          <label class="mui-control"><span>${tr('settings.theme')}</span><select id="settingsThemeQuick"><option value="system" ${state.settings.theme === 'system' ? 'selected' : ''}>${tr('settings.themeSystem')}</option><option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>${tr('settings.themeLight')}</option><option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>${tr('settings.themeDark')}</option></select></label>
          <button class="secondary-button" data-action="nav" data-view="recipes">${tr('nav.recipes')}</button>
        </div>
      </section>
      <section class="settings-summary-grid">
        ${settingsSummaryCard('localProfile', tr('settings.menu.localProfile'), `${escapeHtml(profileName)}<br><span class="muted small">${escapeHtml(emailStatus)} · ${state.activeProfile?.authMethod === 'diet_planner_cloud' ? tr('auth.cloudConnected') : tr('common.localOnly')}</span>`, [state.activeProfile?.authMethod === 'diet_planner_cloud' ? tr('common.connected') : tr('common.localOnly')])}
        ${settingsSummaryCard('macroTargets', tr('settings.menu.macroTargets'), `${round(state.target?.calories || 0)} kcal · P ${round(state.target?.protein || 0)}g · C ${round(state.target?.carbs || 0)}g · F ${round(state.target?.fat || 0)}g`, [])}
        ${settingsSummaryCard('baselineDiet', tr('settings.menu.baselineDiet'), `${baselineSummary.total ? tr('settings.baseline.hasBaseline') : tr('settings.baseline.noBaseline')}<br><span class="muted small">${baselineSummary.recognized} ${tr('settings.baseline.recognized')} · ${baselineSummary.unresolved} ${tr('settings.baseline.unresolved')}</span>`, [])}
        ${settingsSummaryCard('recipeLibrary', tr('settings.menu.recipeLibrary'), `${getAllRecipes().length} ${tr('nav.recipes').toLowerCase()}<br><span class="muted small">${tr('recipe.create')} / ${tr('common.edit')} / ${tr('recipe.duplicate')}</span>`, [])}
        ${settingsSummaryCard('nutritionSources', tr('settings.menu.nutritionSources'), `${tr('settings.nutrition.cloudManaged')}<br><span class="muted small">${enabledProviders} ${tr('common.connected')} · ${tr('common.backendManaged')}</span>`, [tr('settings.nutrition.cloudManaged')])}
        ${settingsSummaryCard('foodDatabase', tr('settings.menu.foodDatabase'), `${tr('settings.foodDatabase.summary', { count: state.foods.length })}<br><span class="muted small">${tr('settings.foodDatabase.add')} · ${tr('settings.foodDatabase.export')}</span>`, [])}
        ${settingsSummaryCard('data', tr('settings.menu.data'), `${tr('settings.data.localFirst')}<br><span class="muted small">${tr('settings.data.exportJson')} / ${tr('settings.data.importJson')}</span>`, [tr('common.localOnly')])}
        ${settingsSummaryCard('preferences', tr('settings.menu.preferences'), `${tr('settings.language')}: ${normalizeLanguage(state.settings.language) === 'it' ? 'Italiano' : 'English'}<br><span class="muted small">${tr('settings.theme')}: ${escapeHtml(state.settings.theme || 'system')}</span>`, [])}
        ${settingsSummaryCard('about', tr('settings.menu.about'), `${tr('settings.about.version')} ${APP_VERSION}<br><span class="muted small">${tr('settings.about.localFirst')}</span>`, [])}
      </section>
    </div>`;
}

function settingsMenuButton(panel) {
  const keyMap = {
    localProfile: 'settings.menu.localProfile',
    macroTargets: 'settings.menu.macroTargets',
    baselineDiet: 'settings.menu.baselineDiet',
    recipeLibrary: 'settings.menu.recipeLibrary',
    nutritionSources: 'settings.menu.nutritionSources',
    foodDatabase: 'settings.menu.foodDatabase',
    data: 'settings.menu.data',
    preferences: 'settings.menu.preferences',
    about: 'settings.menu.about',
  };
  return `<button class="settings-menu-item" data-action="open-settings-panel" data-panel="${panel}" type="button"><span>${tr(keyMap[panel])}</span><span class="chevron">›</span></button>`;
}

function settingsSummaryCard(panel, title, body, chips = []) {
  return `<button class="settings-summary-card" data-action="open-settings-panel" data-panel="${panel}" type="button" aria-label="${escapeHtml(title)}: ${tr('settings.card.open')}">
    <span class="settings-card-copy"><strong>${escapeHtml(title)}</strong><span>${body}</span>${chips.length ? `<span class="chip-row">${chips.map((chip) => `<span class="status-pill blue">${escapeHtml(chip)}</span>`).join('')}</span>` : ''}</span>
    <span class="chevron">›</span>
  </button>`;
}

function summarizeBaseline(raw) {
  const parsed = parseBaselineText(raw || '');
  const items = parsed.flatMap((meal) => meal.items || []);
  return { total: items.length, recognized: items.filter((item) => item.foodId).length, unresolved: items.filter((item) => !item.foodId).length };
}

function openSettingsPanel(panel) {
  const renderers = {
    localProfile: [tr('settings.menu.localProfile'), renderLocalProfilePanel],
    macroTargets: [tr('settings.menu.macroTargets'), renderMacroForm],
    baselineDiet: [tr('settings.menu.baselineDiet'), renderBaselinePanel],
    recipeLibrary: [tr('settings.menu.recipeLibrary'), renderRecipeLibraryPanel],
    nutritionSources: [tr('settings.menu.nutritionSources'), renderNutritionSourcesPanel],
    foodDatabase: [tr('settings.menu.foodDatabase'), renderFoodDatabasePanel],
    data: [tr('settings.menu.data'), renderDataPanel],
    preferences: [tr('settings.menu.preferences'), renderPreferencesForm],
    about: [tr('settings.menu.about'), renderAboutPanel],
  };
  const entry = renderers[panel];
  if (!entry) return;
  const [title, renderer] = entry;
  openDetailPanel(title, `<div class="panel-content stack">${renderer()}</div>`);
}

function initials(name) {
  return String(name || 'Local User').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'LU';
}

function renderLocalProfilePanel() {
  const profile = state.activeProfile || { displayName: 'Local User', email: '' };
  const isCloud = profile.authMethod === 'diet_planner_cloud';
  return html`
    <section class="profile-panel stack">
      <div class="profile-header-card card flat">
        <div class="avatar" aria-label="${tr('settings.profile.avatar')}">${escapeHtml(initials(profile.displayName))}</div>
        <div class="stack-sm">
          <h3>${escapeHtml(profile.displayName || 'Local User')}</h3>
          <p class="muted small">${escapeHtml(profile.email || tr('settings.profile.emailStatus.none'))}</p>
          <span class="status-pill ${isCloud ? 'good' : 'blue'}">${isCloud ? tr('auth.cloudConnected') : tr('common.localOnly')}</span>
        </div>
      </div>
      <div class="info-box small">${isCloud ? tr('auth.cloudHelp') : tr('settings.localProfileNote')}</div>
      ${isCloud ? `<div class="card flat stack-sm"><h3>${tr('auth.cloudTitle')}</h3><p class="muted small">${tr('settings.nutrition.noUserKeys')}</p></div>` : `<div class="grid two">
        <label class="field"><span>${tr('profile.displayName')}</span><input id="localProfileName" value="${escapeHtml(profile.displayName || '')}"></label>
        <label class="field"><span>${tr('profile.email')}</span><input id="localProfileEmail" type="email" value="${escapeHtml(profile.email || '')}"></label>
        <label class="field"><span>${tr('profile.pin')}</span><input id="localProfilePin" type="password" autocomplete="new-password" placeholder="${tr('settings.profile.passwordNone')}"><small class="muted">${tr('settings.profile.setPin')} (${tr('common.optional')})</small></label>
      </div>`}
      <div class="actions">${isCloud ? '' : `<button class="primary-button" data-action="save-local-profile">${tr('settings.profile.editProfile')}</button>`}<button class="danger-button" data-action="logout-profile">${tr('profile.logout')}</button></div>
    </section>`;
}

function baselineExampleText() {
  if (normalizeLanguage(state.settings?.language) === 'it') {
    return `Colazione:\n80g fiocchi d'avena\n30g proteine whey\n1 banana\n\nSpuntino 1:\n170g yogurt greco 0%\n15g mandorle\n\nPranzo:\n150g petto di pollo\n100g riso basmati secco\n200g zucchine\n10g olio d'oliva\n\nSpuntino 2:\n150g skyr\n3 gallette di riso\n\nCena:\n180g salmone\n300g patate\n200g broccoli`;
  }
  return `Breakfast:\n80g oats\n30g whey protein\n1 banana\n\nSnack 1:\n170g Greek yogurt 0%\n15g almonds\n\nLunch:\n150g chicken breast\n100g basmati rice dry\n200g zucchini\n10g olive oil\n\nSnack 2:\n150g skyr\n3 rice cakes\n\nDinner:\n180g salmon\n300g potatoes\n200g broccoli`;
}

function renderBaselinePanel() {
  const summary = summarizeBaseline(state.baseline?.rawText || '');
  return html`
    <section class="stack">
      <div class="info-box small">${tr('settings.baseline.description')}</div>
      <div class="metric-grid compact">
        <div class="metric"><span>${tr('settings.baseline.recognized')}</span><strong>${summary.recognized}</strong></div>
        <div class="metric"><span>${tr('settings.baseline.unresolved')}</span><strong>${summary.unresolved}</strong></div>
      </div>
      <label class="field"><span>${tr('settings.baseline.textLabel')}</span><textarea id="baselineText" class="baseline-textarea">${escapeHtml(state.baseline?.rawText || '')}</textarea></label>
      <div class="actions">
        <button class="secondary-button" data-action="show-baseline-example">${tr('common.showExample')}</button>
        <button class="ghost-button" data-action="use-baseline-example">${tr('common.useExample')}</button>
        <button class="ghost-button" data-action="clear-baseline">${tr('common.clear')}</button>
        <button class="primary-button" data-action="analyze-baseline">${tr('common.analyze')}</button>
      </div>
      <pre id="baselineExampleBox" class="code-example" hidden>${escapeHtml(baselineExampleText())}</pre>
    </section>`;
}

function foodSuggestions(query, max = 3) {
  const needle = normalizeText(query);
  if (!needle) return [];
  return state.foods
    .map((food) => {
      const candidates = [food.name, food.displayNameEn, food.displayNameIt, ...(food.aliases || [])].filter(Boolean).map(normalizeText);
      const score = candidates.reduce((best, alias) => {
        if (alias === needle) return Math.max(best, 100);
        if (alias.includes(needle) || needle.includes(alias)) return Math.max(best, 70);
        const tokens = needle.split(' ').filter(Boolean);
        const tokenHits = tokens.filter((token) => alias.includes(token)).length;
        return Math.max(best, tokenHits * 20);
      }, 0);
      return { food, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.food);
}

function openBaselineReview() {
  const raw = $('baselineText')?.value || SAMPLE_BASELINE;
  const parsed = parseBaselineText(raw);
  const items = parsed.flatMap((meal) => meal.items || []);
  const unresolved = items.filter((item) => !item.foodId);
  openDetailPanel(tr('settings.baseline.reviewTitle'), html`
    <div class="stack">
      <div class="info-box small">${tr('settings.baseline.reviewHelp')}</div>
      <div class="metric-grid compact"><div class="metric"><span>${tr('settings.baseline.recognized')}</span><strong>${items.length - unresolved.length}</strong></div><div class="metric"><span>${tr('settings.baseline.unresolved')}</span><strong>${unresolved.length}</strong></div></div>
      ${unresolved.length ? `<div class="warning-box small stack-sm">${unresolved.map((item) => {
        const suggestions = foodSuggestions(item.rawName || item.foodName);
        return `<div><strong>${tr('settings.baseline.unrecognized')}: "${escapeHtml(item.rawName || item.foodName)}"</strong>${suggestions.length ? `<div class="muted">${tr('settings.baseline.possibleMatches')}: ${suggestions.map((food) => escapeHtml(localizedFoodName(food))).join(', ')}</div>` : ''}</div>`;
      }).join('')}</div>` : ''}
      ${parsed.map((meal, mi) => `<div class="card flat stack-sm"><h3>${mealLabel(meal.slot)}</h3>${meal.items.map((item) => `
        <div class="grid three baseline-row" data-meal-index="${mi}">
          <label class="field"><span>${tr('table.food')}</span><input class="baseline-food" value="${escapeHtml(item.rawName || item.foodName)}"></label>
          <label class="field"><span>Quantity</span><input class="baseline-qty" type="number" step="0.1" value="${escapeHtml(item.quantity)}"></label>
          <label class="field"><span>Unit</span><select class="baseline-unit"><option value="g" ${item.unit === 'g' ? 'selected' : ''}>g</option><option value="ml" ${item.unit === 'ml' ? 'selected' : ''}>ml</option><option value="piece" ${item.unit === 'piece' ? 'selected' : ''}>pieces</option></select></label>
        </div>`).join('') || `<p class="muted small">${tr('settings.baseline.noItems')}</p>`}</div>`).join('')}
      <button class="primary-button" data-action="save-parsed-baseline">${tr('common.save')}</button>
    </div>`);
}

async function saveParsedBaseline() {
  const raw = $('baselineText')?.value || state.baseline.rawText || SAMPLE_BASELINE;
  const mealCards = [...$('modalBody').querySelectorAll('.card.flat')];
  const meals = mealCards.map((card, i) => {
    const slotText = card.querySelector('h3')?.textContent || MEAL_SLOTS[i]?.slot || `Meal ${i + 1}`;
    const slot = normalizedMealSlot(slotText);
    const rows = [...card.querySelectorAll('.baseline-row')];
    const items = rows.map((row) => {
      const name = row.querySelector('.baseline-food').value.trim();
      const qty = Number(row.querySelector('.baseline-qty').value || 0);
      const unit = row.querySelector('.baseline-unit').value;
      const food = lookupFood(name);
      const normalizedUnit = normalizeUnit(unit, qty, food);
      return { id: uuid('item'), foodId: food?.id || null, foodName: food?.name || name, rawName: name, quantity: qty, unit: normalizedUnit, grams: quantityToGrams(qty, normalizedUnit, food), originalGrams: quantityToGrams(qty, normalizedUnit, food), locked: false, notes: '', source: food?.source || 'Manual value required', confidence: food?.confidence || 'unknown' };
    }).filter((item) => item.foodName && item.quantity > 0);
    return { id: uuid('template'), slot, items, notes: '' };
  }).filter((meal) => MEAL_SLOTS.some((slot) => slot.slot === meal.slot));
  state.baseline = { id: 'baseline', rawText: raw, meals, updatedAt: new Date().toISOString(), userId: state.activeUserId };
  await idbPut('baseline', state.baseline);
  await loadState();
  closeModal();
  render();
  toast(tr('settings.baseline.saved'));
}

function renderNutritionSourcesPanel() {
  const providers = (state.nutritionProviders || NUTRITION_PROVIDERS).slice().sort((a, b) => (a.priority || 99) - (b.priority || 99));
  const enabledCount = providers.filter((provider) => provider.enabled !== false).length;
  return html`
    <section class="stack">
      <div class="info-box small"><strong>${tr('settings.nutrition.cloudStatus')}:</strong> ${tr('settings.nutrition.cloudManaged')}. ${tr('settings.nutrition.noUserKeys')}</div>
      <div class="card flat stack-sm">
        <div class="row between"><h3>Diet Planner Cloud</h3><span class="status-pill ${enabledCount ? 'good' : 'warn'}">${enabledCount ? tr('common.connected') : tr('common.disconnected')}</span></div>
        <p class="muted small">USDA_FDC_API_KEY, OPENFOODFACTS_ENABLED, and NUTRITION_CACHE_TTL_DAYS are read only by the backend process.</p>
        <div class="actions"><button class="secondary-button" data-action="refresh-provider-status">${tr('settings.nutrition.testKey')}</button></div>
      </div>
      <div class="card flat stack-sm"><h3>${tr('settings.nutrition.priority')}</h3><ol class="priority-list"><li>${tr('settings.nutrition.userFoods')}</li><li>${tr('settings.nutrition.cache')}</li><li>${tr('settings.nutrition.curated')}</li><li>${tr('settings.nutrition.usdaIfKey')}</li><li>${tr('settings.nutrition.offFallback')}</li><li>${tr('settings.nutrition.manual')}</li></ol></div>
      <div class="grid two">
        ${providers.map((provider) => `<div class="card flat stack-sm"><div class="row between"><h3>${escapeHtml(provider.name || provider.id)}</h3><span class="status-pill ${provider.enabled === false ? 'warn' : 'good'}">${provider.enabled === false ? tr('common.disconnected') : tr('common.connected')}</span></div><p class="muted small">${escapeHtml(provider.id)} · ${provider.requiresApiKey ? tr('common.backendManaged') : tr('common.connected')}</p></div>`).join('')}
      </div>
      <div class="info-box small">${tr('settings.nutrition.cacheNote')}</div>
    </section>`;
}

function renderFoodDatabasePanel() {
  return html`
    <section class="stack">
      <div class="row between"><p class="muted small">${tr('settings.foodDatabase.summary', { count: state.foods.length })}</p><button class="secondary-button" data-action="open-food-editor">${tr('settings.foodDatabase.add')}</button></div>
      <div class="actions"><button class="ghost-button" data-action="open-food-lookup">${tr('lookup.title')}</button><button class="ghost-button" data-action="export-food-csv">${tr('settings.foodDatabase.export')}</button></div>
      <div class="warning-box small">${tr('warning.seedValues')}</div>
      ${renderFoodTable()}
    </section>`;
}

function renderDataPanel() {
  return html`
    <section class="stack">
      <div class="info-box small">${tr('settings.data.localFirst')}</div>
      <div class="actions"><button class="primary-button" data-action="export-json">${tr('settings.data.exportJson')}</button><label class="secondary-button">${tr('settings.data.importJson')}<input id="importJson" type="file" accept="application/json" hidden></label></div>
      <div class="grid two"><button class="ghost-button" data-action="export-food-csv">${tr('settings.foodDatabase.export')}</button><button class="ghost-button" data-action="export-body-csv">Export body CSV</button><button class="ghost-button" data-action="export-blood-csv">Export blood CSV</button></div>
    </section>`;
}

function renderAboutPanel() {
  return html`
    <section class="stack">
      <div class="card flat stack-sm"><h3>Diet Planner</h3><p>${tr('settings.about.version')}: ${APP_VERSION}</p><p class="muted small">${tr('settings.about.localFirst')}</p></div>
      <div class="card flat stack-sm"><h3>PWA</h3><p class="muted small">Installable static app. Works over HTTPS after first load and stores plans in IndexedDB.</p></div>
    </section>`;
}

function renderPreferencesForm() {
  const s = state.settings;
  return html`
    <div class="form-grid">
      <label class="field"><span>${tr('settings.language')}</span><select id="pref_language"><option value="en" ${normalizeLanguage(s.language) === 'en' ? 'selected' : ''}>English</option><option value="it" ${normalizeLanguage(s.language) === 'it' ? 'selected' : ''}>Italiano</option></select></label>
      <label class="field"><span>${tr('settings.theme')}</span><select id="pref_theme"><option value="system" ${s.theme === 'system' ? 'selected' : ''}>${tr('settings.themeSystem')}</option><option value="light" ${s.theme === 'light' ? 'selected' : ''}>${tr('settings.themeLight')}</option><option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>${tr('settings.themeDark')}</option></select></label>
      <label class="field"><span>${tr('prefs.prepDay')}</span><select id="pref_prepDay">${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => `<option ${s.prepDay === d ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
      <label class="field"><span>${tr('prefs.lunchMode')}</span><select id="pref_lunchMode"><option value="same" ${s.lunchMode === 'same' ? 'selected' : ''}>${tr('prefs.sameLunch')}</option><option value="rotating" ${s.lunchMode === 'rotating' ? 'selected' : ''}>${tr('prefs.rotatingLunch')}</option><option value="baseline" ${s.lunchMode === 'baseline' ? 'selected' : ''}>${tr('prefs.baselineLunch')}</option></select></label>
      <label class="field"><span>${tr('prefs.units')}</span><select id="pref_units"><option value="metric" ${s.units === 'metric' ? 'selected' : ''}>${tr('prefs.metric')}</option></select></label>
    </div>
    ${prefArea('likedFoods', tr('prefs.likedFoods'))}
    ${prefArea('dislikedFoods', tr('prefs.dislikedFoods'))}
    ${prefArea('excludedFoods', tr('prefs.excludedFoods'))}
    ${prefArea('allergies', tr('prefs.allergies'))}
    ${prefArea('preferredProtein', tr('prefs.preferredProtein'))}
    ${prefArea('preferredCarbs', tr('prefs.preferredCarbs'))}
    ${prefArea('preferredFats', tr('prefs.preferredFats'))}
    <button class="primary-button" data-action="save-preferences">${tr('common.save')}</button>`;
}

function renderMacroForm() {
  const t = state.target;
  return html`
    <div class="form-grid">
      ${macroInput('calories', tr('macro.dailyCaloriesTarget'), t.calories, 'kcal')}
      ${macroInput('protein', tr('macro.dailyProteinTarget'), t.protein, 'g')}
      ${macroInput('carbs', tr('macro.dailyCarbsTarget'), t.carbs, 'g')}
      ${macroInput('fat', tr('macro.dailyFatTarget'), t.fat, 'g')}
      ${macroInput('tolCalories', tr('macro.toleranceCalories'), t.tolerance?.caloriesPct ?? 5, '%')}
      ${macroInput('tolProtein', tr('macro.toleranceProtein'), t.tolerance?.protein ?? 5, 'g')}
      ${macroInput('tolCarbs', tr('macro.toleranceCarbs'), t.tolerance?.carbs ?? 10, 'g')}
      ${macroInput('tolFat', tr('macro.toleranceFat'), t.tolerance?.fat ?? 5, 'g')}
    </div>
    <label class="field"><span>${tr('recipe.notes')}</span><textarea id="macro_notes">${escapeHtml(t.notes || '')}</textarea></label>
    ${macroValidationMessage(t)}
    <details class="collapsible"><summary>${tr('macro.optionalTargets')}</summary><div class="grid two"><div class="stack-sm"><label class="checkbox-row"><input type="checkbox" id="workoutTargetEnabled" ${t.workout?.enabled ? 'checked' : ''}> <span>${tr('macro.useWorkout')}</span></label><div class="form-grid">${macroInput('workoutCalories', 'Workout calories', t.workout?.calories ?? t.calories, 'kcal')}${macroInput('workoutProtein', 'Workout protein', t.workout?.protein ?? t.protein, 'g')}${macroInput('workoutCarbs', 'Workout carbs', t.workout?.carbs ?? t.carbs, 'g')}${macroInput('workoutFat', 'Workout fat', t.workout?.fat ?? t.fat, 'g')}</div></div><div class="stack-sm"><label class="checkbox-row"><input type="checkbox" id="restTargetEnabled" ${t.rest?.enabled ? 'checked' : ''}> <span>${tr('macro.useRest')}</span></label><div class="form-grid">${macroInput('restCalories', 'Rest calories', t.rest?.calories ?? t.calories, 'kcal')}${macroInput('restProtein', 'Rest protein', t.rest?.protein ?? t.protein, 'g')}${macroInput('restCarbs', 'Rest carbs', t.rest?.carbs ?? t.carbs, 'g')}${macroInput('restFat', 'Rest fat', t.rest?.fat ?? t.fat, 'g')}</div></div></div></details>
    <button class="primary-button" data-action="save-target">${tr('macro.save')}</button>`;
}

function renderFoodTable() {
  return html`<div class="table-wrap"><table><thead><tr><th>${tr('table.food')}</th><th>${tr('table.per100g')}</th><th>${tr('table.source')}</th><th>${tr('table.confidence')}</th><th></th></tr></thead><tbody>${state.foods.map((f) => `<tr><td><strong>${escapeHtml(localizedFoodName(f))}</strong><div class="small muted">${escapeHtml((f.aliases || []).slice(0, 4).join(', '))}</div></td><td>${round(f.caloriesPer100g)} kcal · P ${round(f.proteinPer100g, 1)} · C ${round(f.carbsPer100g, 1)} · F ${round(f.fatPer100g, 1)}</td><td class="small muted">${escapeHtml(f.sourceProvider || f.source || '')}</td><td>${confidencePill(f.confidence)}</td><td><button class="pill-button" data-action="open-food-editor" data-food-id="${f.id}">${tr('common.edit')}</button></td></tr>`).join('')}</tbody></table></div>`;
}

async function savePreferencesFromForm() {
  const settings = {
    prepDay: $('pref_prepDay')?.value || state.settings.prepDay,
    lunchMode: $('pref_lunchMode')?.value || state.settings.lunchMode,
    units: $('pref_units')?.value || state.settings.units,
    language: $('pref_language')?.value || state.settings.language,
    theme: $('pref_theme')?.value || state.settings.theme,
    likedFoods: $('pref_likedFoods')?.value ?? state.settings.likedFoods,
    dislikedFoods: $('pref_dislikedFoods')?.value ?? state.settings.dislikedFoods,
    excludedFoods: $('pref_excludedFoods')?.value ?? state.settings.excludedFoods,
    allergies: $('pref_allergies')?.value ?? state.settings.allergies,
    preferredProtein: $('pref_preferredProtein')?.value ?? state.settings.preferredProtein,
    preferredCarbs: $('pref_preferredCarbs')?.value ?? state.settings.preferredCarbs,
    preferredFats: $('pref_preferredFats')?.value ?? state.settings.preferredFats,
  };
  await saveSettings(settings);
  await loadState();
  renderNav();
  render();
  toast(tr('settings.preferences.saved'));
}


async function loadCloudRecipesIfAvailable() {
  if (!isCloudSessionActive()) return;
  try {
    const payload = await apiRequest('/api/recipes');
    if (Array.isArray(payload?.recipes)) {
      for (const recipeRecord of payload.recipes.map(normalizeRecipeRecord)) await idbPut('recipes', recipeRecord);
    }
  } catch (error) {
    console.warn('Cloud recipe sync failed:', error.message);
  }
}

async function saveRecipeToCloud(recipeRecord, isNew = false) {
  if (!isCloudSessionActive()) return;
  const path = isNew ? '/api/recipes' : `/api/recipes/${encodeURIComponent(recipeRecord.id)}`;
  const method = isNew ? 'POST' : 'PUT';
  try { await apiRequest(path, { method, body: recipeRecord }); } catch (error) { console.warn('Cloud recipe save failed:', error.message); }
}

async function deleteRecipeFromCloud(recipeId) {
  if (!isCloudSessionActive()) return;
  try { await apiRequest(`/api/recipes/${encodeURIComponent(recipeId)}`, { method: 'DELETE' }); } catch (error) { console.warn('Cloud recipe delete failed:', error.message); }
}


function renderRecipes() {
  const recipes = getAllRecipes();
  const filterOptions = ['all', ...MEAL_SLOTS.map((m) => m.slot)];
  return html`
    <div class="stack recipe-page">
      <section class="card stack">
        <div class="card-title-row">
          <div>
            <h2>${tr('nav.recipes')}</h2>
            <p class="muted small">Create, edit, duplicate, and assign recipes independently from Settings. Recipes can be used as meal alternatives and in generated meal plans.</p>
          </div>
          <button class="primary-button" data-action="open-recipe-editor">${tr('recipe.create')}</button>
        </div>
        <div class="grid two">
          <label class="field"><span>${tr('recipe.search')}</span><input id="recipeSearch" data-action="filter-recipes" placeholder="${tr('common.search')}"></label>
          <label class="field"><span>${tr('recipe.filterMeal')}</span><select id="recipeMealFilter" data-action="filter-recipes">${filterOptions.map((slot) => `<option value="${slot}">${slot === 'all' ? tr('common.filter') : mealLabel(slot)}</option>`).join('')}</select></label>
        </div>
      </section>
      <section id="recipeList" class="recipe-list grid two">${renderRecipeCards(recipes)}</section>
    </div>`;
}

function renderRecipeLibraryPanel() {
  const recipes = getAllRecipes();
  const filterOptions = ['all', ...MEAL_SLOTS.map((m) => m.slot)];
  return html`
    <section class="stack recipe-library-panel">
      <div class="actions"><button class="primary-button" data-action="open-recipe-editor">${tr('recipe.create')}</button></div>
      <div class="grid two"><label class="field"><span>${tr('recipe.search')}</span><input id="recipeSearch" data-action="filter-recipes" placeholder="${tr('common.search')}"></label><label class="field"><span>${tr('recipe.filterMeal')}</span><select id="recipeMealFilter" data-action="filter-recipes">${filterOptions.map((slot) => `<option value="${slot}">${slot === 'all' ? tr('common.filter') : mealLabel(slot)}</option>`).join('')}</select></label></div>
      <div id="recipeList" class="recipe-list stack-sm">${renderRecipeCards(recipes)}</div>
    </section>`;
}

function renderRecipeCards(recipes) {
  return recipes.length ? recipes.map((recipeRecord) => renderRecipeCard(recipeRecord)).join('') : `<p class="muted small">${tr('recipe.noRecipes')}</p>`;
}

function renderRecipeCard(recipeRecord) {
  const macros = calcRecipeMacros(recipeRecord);
  return `<article class="card flat recipe-card" data-recipe-name="${escapeHtml(normalizeText(recipeDisplayName(recipeRecord)))}" data-meal-type="${escapeHtml(recipeRecord.mealType)}"><div class="row between"><div><h3>${escapeHtml(recipeDisplayName(recipeRecord))}</h3><p class="muted small">${mealLabel(recipeRecord.mealType)} · ${totalsText(macros)}</p></div><span>${confidencePill(recipeRecord.confidence)}</span></div><div class="chip-row"><span class="status-pill blue">${escapeHtml(recipeRecord.source || 'recipe')}</span><span class="status-pill">${recipeRecord.ingredients.length} ${tr('recipe.ingredients')}</span></div><div class="actions"><button class="secondary-button" data-action="open-recipe-editor" data-recipe-id="${recipeRecord.id}">${tr('common.edit')}</button><button class="ghost-button" data-action="duplicate-recipe" data-recipe-id="${recipeRecord.id}">${tr('recipe.duplicate')}</button>${recipeRecord.source === 'seed_recipe' ? '' : `<button class="danger-button" data-action="delete-recipe" data-recipe-id="${recipeRecord.id}">${tr('common.delete')}</button>`}</div></article>`;
}

function openRecipeEditor(recipeId = null) {
  const recipeRecord = recipeId ? getRecipeById(recipeId) : normalizeRecipeRecord({ id: '', name: '', displayNameEn: '', displayNameIt: '', mealType: 'Lunch', ingredients: [], instructions: [], source: 'user_recipe', userId: state.activeUserId });
  const isNew = !recipeId;
  openDetailPanel(isNew ? tr('recipe.create') : tr('recipe.edit'), html`
    <div class="stack recipe-editor">
      <div class="form-grid">
        <label class="field"><span>${tr('recipe.name')}</span><input id="recipeName" value="${escapeHtml(recipeDisplayName(recipeRecord) || '')}"></label>
        <label class="field"><span>${tr('recipe.mealType')}</span><select id="recipeMealType">${MEAL_SLOTS.map((m) => `<option value="${m.slot}" ${recipeRecord.mealType === m.slot ? 'selected' : ''}>${mealLabel(m.slot)}</option>`).join('')}</select></label>
        <label class="field"><span>${tr('recipe.servings')}</span><input id="recipeServings" type="number" step="0.1" value="${escapeHtml(recipeRecord.servings || 1)}"></label>
        <label class="field"><span>${tr('recipe.prepTime')}</span><input id="recipePrep" type="number" value="${escapeHtml(recipeRecord.prepTimeMinutes || 0)}"></label>
        <label class="field"><span>${tr('recipe.cookTime')}</span><input id="recipeCook" type="number" value="${escapeHtml(recipeRecord.cookTimeMinutes || 0)}"></label>
      </div>
      <section class="stack-sm"><h3>${tr('recipe.ingredients')}</h3><div id="recipeIngredients">${recipeIngredients(recipeRecord).map(renderRecipeIngredientRow).join('') || renderRecipeIngredientRow()}</div><button class="secondary-button" data-action="add-recipe-ingredient-row">${tr('recipe.addIngredient')}</button></section>
      <label class="field"><span>${tr('recipe.instructions')}</span><textarea id="recipeInstructions" placeholder="One step per line">${escapeHtml((recipeRecord.instructions || []).join('\n'))}</textarea></label>
      <label class="field"><span>${tr('recipe.notes')}</span><textarea id="recipeNotes">${escapeHtml(recipeRecord.notes || '')}</textarea></label>
      <datalist id="foodNameList">${state.foods.map((food) => `<option value="${escapeHtml(localizedFoodName(food))}"></option><option value="${escapeHtml(food.name)}"></option>`).join('')}</datalist>
      <div class="actions"><button class="primary-button" data-action="save-recipe" data-recipe-id="${recipeId || ''}">${tr('common.save')}</button>${recipeId && recipeRecord.source !== 'seed_recipe' ? `<button class="danger-button" data-action="delete-recipe" data-recipe-id="${recipeId}">${tr('common.delete')}</button>` : ''}</div>
    </div>`);
}

function renderRecipeIngredientRow(ingredient = {}) {
  const food = ingredient.foodId ? getFoodById(ingredient.foodId) : null;
  const name = food ? localizedFoodName(food) : (ingredient.name || '');
  return `<div class="grid three card flat recipe-ingredient-row"><label class="field"><span>${tr('table.food')}</span><input class="recipe-food" value="${escapeHtml(name)}" list="foodNameList"></label><label class="field"><span>Quantity</span><input class="recipe-qty" type="number" step="0.1" value="${escapeHtml(ingredient.quantity ?? '')}"></label><label class="field"><span>Unit</span><select class="recipe-unit"><option value="g" ${ingredient.unit === 'g' ? 'selected' : ''}>g</option><option value="ml" ${ingredient.unit === 'ml' ? 'selected' : ''}>ml</option><option value="piece" ${ingredient.unit === 'piece' ? 'selected' : ''}>pieces</option></select></label></div>`;
}

async function saveRecipeFromEditor(recipeId = null) {
  const name = $('recipeName')?.value.trim();
  if (!name) { toast('Recipe name is required.'); return; }
  const mealType = $('recipeMealType')?.value || 'Lunch';
  const ingredients = [...document.querySelectorAll('.recipe-ingredient-row')].map((row) => {
    const rawName = row.querySelector('.recipe-food')?.value.trim() || '';
    const food = lookupFood(rawName);
    const quantity = Number(row.querySelector('.recipe-qty')?.value || 0);
    const unit = row.querySelector('.recipe-unit')?.value || 'g';
    return normalizeRecipeIngredient({ foodId: food?.id || null, name: rawName, quantity, unit });
  }).filter((ingredient) => ingredient.name && ingredient.quantity > 0);
  const existing = recipeId ? getRecipeById(recipeId) : null;
  const recipeRecord = normalizeRecipeRecord({
    ...(existing || {}),
    id: recipeId || uuid('recipe'),
    userId: existing?.userId ?? state.activeUserId,
    name,
    displayNameEn: name,
    displayNameIt: name,
    mealType,
    slot: mealType,
    servings: Number($('recipeServings')?.value || 1),
    ingredients,
    instructions: ($('recipeInstructions')?.value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    prepTimeMinutes: Number($('recipePrep')?.value || 0),
    cookTimeMinutes: Number($('recipeCook')?.value || 0),
    notes: $('recipeNotes')?.value || '',
    source: existing?.source === 'seed_recipe' ? 'user_recipe' : 'user_recipe',
    confidence: ingredients.every((ingredient) => ingredient.foodId) ? 'medium' : 'low',
    updatedAt: new Date().toISOString(),
  });
  await idbPut('recipes', recipeRecord);
  await saveRecipeToCloud(recipeRecord, !existing);
  await loadState();
  toast(tr('recipe.saved'));
  if (state.view === 'recipes') render(); else openSettingsPanel('recipeLibrary');
}

async function deleteRecipe(recipeId) {
  const recipeRecord = getRecipeById(recipeId);
  if (!recipeRecord || recipeRecord.source === 'seed_recipe') return;
  await idbDelete('recipes', recipeId);
  await deleteRecipeFromCloud(recipeId);
  await loadState();
  toast(tr('recipe.deleted'));
  if (state.view === 'recipes') render(); else openSettingsPanel('recipeLibrary');
}

async function duplicateRecipe(recipeId) {
  const recipeRecord = getRecipeById(recipeId);
  if (!recipeRecord) return;
  const copy = normalizeRecipeRecord({ ...deepClone(recipeRecord), id: uuid('recipe'), name: `${recipeDisplayName(recipeRecord)} copy`, displayNameEn: `${recipeDisplayName(recipeRecord)} copy`, displayNameIt: `${recipeDisplayName(recipeRecord)} copy`, userId: state.activeUserId, source: 'user_recipe', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  await idbPut('recipes', copy);
  await loadState();
  toast(tr('recipe.duplicated'));
  if (state.view === 'recipes') render(); else openSettingsPanel('recipeLibrary');
}

function applyRecipeFilter() {
  const list = $('recipeList');
  if (!list) return;
  const q = normalizeText($('recipeSearch')?.value || '');
  const slot = $('recipeMealFilter')?.value || 'all';
  const recipes = getAllRecipes().filter((recipeRecord) => (!q || normalizeText(recipeDisplayName(recipeRecord)).includes(q)) && (slot === 'all' || recipeRecord.mealType === slot));
  list.innerHTML = renderRecipeCards(recipes);
}

function openMealDetail(date, mealId) {
  const day = findPlan(date);
  const meal = day?.meals.find((m) => m.id === mealId);
  if (!meal) return;
  const macros = calcMealMacros(meal);
  const alternativeRecipes = getAllRecipes().filter((recipeRecord) => recipeRecord.mealType === meal.slot && recipeDisplayName(recipeRecord) !== meal.recipeName);
  openDetailPanel(mealLabel(meal.slot), html`
    <div class="stack">
      <div class="card flat stack-sm"><div class="row between"><div><h3>${escapeHtml(meal.recipeName || tr('meal.recipeViewer'))}</h3><p>${totalsText(macros)}</p></div>${confidencePill((meal.items || []).some((i) => i.confidence === 'unknown') ? 'unknown' : 'medium')}</div></div>
      <section class="card flat stack-sm"><h3>${tr('meal.ingredients')}</h3><ul class="food-list detail-food-list">${(meal.items || []).map((item) => `<li><strong>${escapeHtml(item.foodName)}</strong><span>${displayQuantity(item)} · ${confidencePill(item.confidence || 'unknown')}</span></li>`).join('') || `<li><span>${tr('meal.noFoods')}</span></li>`}</ul></section>
      ${meal.instructions?.length ? `<section class="card flat"><h3>${tr('meal.instructions')}</h3><ol>${meal.instructions.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></section>` : ''}
      <section class="card flat stack-sm"><h3>${tr('recipe.alternatives')}</h3>${alternativeRecipes.slice(0, 5).map((recipeRecord) => renderMealAlternative(day, meal, recipeRecord)).join('') || `<p class="muted small">${tr('recipe.noRecipes')}</p>`}</section>
      <div class="actions"><button class="secondary-button" data-action="complete-meal" data-date="${date}" data-meal-id="${mealId}">${tr('common.completed')}</button><button class="ghost-button" data-action="skip-meal" data-date="${date}" data-meal-id="${mealId}">${tr('common.skipped')}</button><button class="ghost-button" data-action="change-recipe" data-date="${date}" data-meal-id="${mealId}">${tr('meal.changeRecipe')}</button><button class="ghost-button" data-action="edit-meal" data-date="${date}" data-meal-id="${mealId}">${tr('meal.editMeal')}</button></div>
    </div>`);
}

function renderMealAlternative(day, meal, recipeRecord) {
  const targetMacros = calcMealMacros(meal);
  const candidate = createMealFromRecipe(recipeRecord, day.date);
  scaleMealsToTarget([candidate], targetMacros, { tolerance: { caloriesPct: 8, protein: 8, carbs: 10, fat: 6 } });
  const macros = calcMealMacros(candidate);
  return `<div class="alternative-card"><div><strong>${escapeHtml(recipeDisplayName(recipeRecord))}</strong><p class="muted small">${tr('meal.swapChanges')}: ${macroDiffHtml(macros, targetMacros)}</p></div><button class="secondary-button" data-action="apply-recipe-alternative" data-date="${day.date}" data-meal-id="${meal.id}" data-recipe-id="${recipeRecord.id}">${tr('meal.applyAlternative')}</button></div>`;
}

async function applyRecipeAlternative(date, mealId, recipeId) {
  const day = findPlan(date);
  const idx = day?.meals.findIndex((m) => m.id === mealId);
  const recipeRecord = getRecipeById(recipeId);
  if (!day || idx < 0 || !recipeRecord) return;
  const original = day.meals[idx];
  const targetMacros = calcMealMacros(original);
  const selected = createMealFromRecipe(recipeRecord, date);
  scaleMealsToTarget([selected], targetMacros, { tolerance: { caloriesPct: 8, protein: 8, carbs: 10, fat: 6 } });
  selected.id = original.id;
  selected.status = original.status === 'completed' ? 'planned' : original.status;
  selected.originalItems = deepClone(original.originalItems || original.items);
  selected.adjustments = [...(original.adjustments || []), { at: new Date().toISOString(), type: 'recipe_alternative', from: original.recipeName, to: selected.recipeName }];
  day.meals[idx] = selected;
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  render();
  openMealDetail(date, mealId);
}

async function changeRecipe(date, mealId) {
  const day = findPlan(date);
  const idx = day?.meals.findIndex((m) => m.id === mealId);
  if (idx == null || idx < 0) return;
  const original = day.meals[idx];
  const targetMacros = calcMealMacros(original);
  const recipes = getAllRecipes().filter((recipeRecord) => recipeRecord.mealType === original.slot && recipeDisplayName(recipeRecord) !== original.recipeName);
  if (!recipes.length) { toast('No local alternative recipe for this meal slot yet.'); return; }
  const excluded = normalizeText(state.settings.excludedFoods || '');
  const filtered = recipes.filter((recipeRecord) => !recipeIngredients(recipeRecord).some((ingredient) => excluded.includes(normalizeText(getFoodById(ingredient.foodId)?.name || ingredient.name || ''))));
  const pool = filtered.length ? filtered : recipes;
  const candidates = pool.map((recipeRecord) => {
    const meal = createMealFromRecipe(recipeRecord, date);
    scaleMealsToTarget([meal], targetMacros, { tolerance: { caloriesPct: 8, protein: 8, carbs: 10, fat: 6 } });
    const totals = calcMealMacros(meal);
    const score = Math.abs(totals.calories - targetMacros.calories) + Math.abs(totals.protein - targetMacros.protein) * 15 + Math.abs(totals.carbs - targetMacros.carbs) * 6 + Math.abs(totals.fat - targetMacros.fat) * 9;
    return { recipe: recipeRecord, meal, totals, score };
  }).sort((a, b) => a.score - b.score);
  const selected = candidates[0].meal;
  selected.id = original.id;
  selected.status = original.status === 'completed' ? 'planned' : original.status;
  selected.originalItems = deepClone(original.originalItems || original.items);
  selected.adjustments = [...(original.adjustments || []), { at: new Date().toISOString(), type: 'recipe_change', from: original.recipeName, to: selected.recipeName }];
  day.meals[idx] = selected;
  day.updatedAt = new Date().toISOString();
  await idbPut('plans', day);
  await loadState();
  render();
  openDetailPanel('Recipe changed', `<div class="stack"><div class="success-box small">Changed ${escapeHtml(mealLabel(original.slot))} to <strong>${escapeHtml(selected.recipeName)}</strong>.</div><div class="grid two"><div class="card flat"><h3>Original macros</h3><p>${totalsText(targetMacros)}</p></div><div class="card flat"><h3>New macros</h3><p>${totalsText(calcMealMacros(selected))}</p>${macroDiffHtml(calcMealMacros(selected), targetMacros)}</div></div></div>`);
}

function applyPreWorkoutMeal(day) {
  const workoutMinutes = timeToMinutes(day.workout.time || '18:30');
  const candidates = day.meals.filter((m) => timeToMinutes(m.time || '00:00') < workoutMinutes && m.status !== 'completed' && m.status !== 'skipped');
  const meal = candidates[candidates.length - 1];
  if (!meal) return null;
  const idx = day.meals.findIndex((m) => m.id === meal.id);
  const originalMacros = calcMealMacros(meal);
  const recipeObj = getRecipeById('preworkout_skyr_banana') || RECIPE_LIBRARY.find((r) => r.id === 'preworkout_skyr_banana');
  const newMeal = createMealFromRecipe({ ...recipeObj, slot: meal.slot, mealType: meal.slot }, day.date);
  const preTarget = { calories: originalMacros.calories, protein: Math.max(originalMacros.protein, 25), carbs: Math.max(originalMacros.carbs, 45), fat: Math.min(originalMacros.fat, 8) };
  scaleMealsToTarget([newMeal], preTarget, { tolerance: { caloriesPct: 12, protein: 8, carbs: 12, fat: 4 } });
  newMeal.id = meal.id;
  newMeal.time = meal.time;
  newMeal.slot = meal.slot;
  newMeal.status = 'planned';
  newMeal.originalItems = deepClone(meal.originalItems || meal.items);
  newMeal.adjustments = [...(meal.adjustments || []), { at: new Date().toISOString(), type: 'pre_workout', workoutTime: day.workout.time }];
  day.meals[idx] = newMeal;
  const fixedMeals = day.meals.filter((m) => m.id === newMeal.id || m.status === 'skipped' || m.status === 'completed');
  const fixedProjected = fixedMeals.filter((m) => m.status !== 'skipped').reduce((acc, m) => addMacros(acc, calcMealMacros(m)), emptyMacros());
  const remainingTarget = subtractMacros(getTargetForDay(day), fixedProjected);
  for (const key of ['calories', 'protein', 'carbs', 'fat']) remainingTarget[key] = Math.max(0, remainingTarget[key]);
  const adjustable = day.meals.filter((m) => m.status === 'planned' && m.id !== newMeal.id && !m.locked);
  scaleMealsToTarget(adjustable, remainingTarget);
  return newMeal;
}

async function regenerateDay(date) {
  const lunchMode = state.settings.lunchMode;
  let lunchOverride = null;
  if (lunchMode === 'rotating') lunchOverride = getAllRecipes().find((recipeRecord) => recipeRecord.mealType === 'Lunch') || null;
  const day = makeDayPlan(date, lunchOverride);
  scaleDayToTarget(day, getTargetForDay(day));
  await idbPut('plans', day);
  await loadState();
  render();
  toast('Day regenerated.');
}

async function saveLocalProfileFromPanel() {
  if (!state.activeProfile) return;
  const displayName = $('localProfileName')?.value.trim() || state.activeProfile.displayName || 'Local User';
  const email = $('localProfileEmail')?.value.trim() || '';
  const pin = $('localProfilePin')?.value || '';
  const updated = { ...state.activeProfile, displayName, email, updatedAt: new Date().toISOString() };
  if (pin) {
    const hashed = await hashPassword(pin);
    updated.hasPassword = true;
    updated.passwordHash = hashed.hash;
    updated.passwordSalt = hashed.salt;
    updated.authMethod = 'password';
  }
  await idbPut('profiles', updated);
  await loadState();
  renderNav();
  render();
  openSettingsPanel('localProfile');
  toast(tr('common.saved'));
}

async function saveUsdaKeyFromPanel() {
  await refreshNutritionProviders();
  openSettingsPanel('nutritionSources');
  toast(tr('common.saved'));
}

async function removeUsdaKeyFromPanel() {
  await refreshNutritionProviders();
  openSettingsPanel('nutritionSources');
}

async function testUsdaKeyFromPanel() {
  await refreshNutritionProviders();
  openSettingsPanel('nutritionSources');
}

function setupPremiumEvents() {
  document.addEventListener('change', async (event) => {
    if (event.target.id === 'settingsLanguageQuick') { await saveSettings({ language: event.target.value }); await loadState(); renderNav(); render(); }
    if (event.target.id === 'settingsThemeQuick') { await saveSettings({ theme: event.target.value }); await loadState(); render(); }
    if (event.target.id === 'recipeSearch' || event.target.id === 'recipeMealFilter') applyRecipeFilter();
  });
  document.addEventListener('input', (event) => {
    if (event.target.id === 'recipeSearch') applyRecipeFilter();
  });
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'open-settings-panel') openSettingsPanel(button.dataset.panel);
    if (action === 'show-baseline-example') { const box = $('baselineExampleBox'); if (box) box.hidden = !box.hidden; }
    if (action === 'use-baseline-example') { if ($('baselineText')) $('baselineText').value = baselineExampleText(); }
    if (action === 'clear-baseline') { if ($('baselineText')) $('baselineText').value = ''; }
    if (action === 'analyze-baseline') openBaselineReview();
    if (action === 'save-local-profile') await saveLocalProfileFromPanel();
    if (action === 'refresh-provider-status') { await refreshNutritionProviders(); openSettingsPanel('nutritionSources'); }
    if (action === 'open-recipe-editor') openRecipeEditor(button.dataset.recipeId || null);
    if (action === 'add-recipe-ingredient-row') $('recipeIngredients')?.insertAdjacentHTML('beforeend', renderRecipeIngredientRow());
    if (action === 'save-recipe') await saveRecipeFromEditor(button.dataset.recipeId || null);
    if (action === 'delete-recipe') await deleteRecipe(button.dataset.recipeId);
    if (action === 'duplicate-recipe') await duplicateRecipe(button.dataset.recipeId);
    if (action === 'apply-recipe-alternative') await applyRecipeAlternative(button.dataset.date, button.dataset.mealId, button.dataset.recipeId);
  });
}

async function init() {
  state.db = await openDb();
  await seedIfNeeded();
  await refreshCloudUser();
  await loadState();
  await loadCloudRecipesIfAvailable();
  await loadState();
  if (state.activeProfile) await ensureStarterPlan();
  renderNav();
  render();
  setupEvents();
  setupPremiumEvents();
  registerServiceWorker();
}


function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // Service worker can fail on file://. The app still works when served locally.
    });
  }
}

init().catch((error) => {
  console.error(error);
  document.body.innerHTML = `<main class="main-content"><div class="card danger-box"><h1>Diet Planner failed to start</h1><pre>${escapeHtml(error.stack || error.message)}</pre></div></main>`;
});
