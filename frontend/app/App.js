import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import ContestCard from './Components/cards';

export default function App() {
  // Sample data matching your UI image exactly
  const contestData = [
    {
      id: 1,
      isPractice: false,
      prizePool: 'Amount',
      entryFee: 49,
      spotsLeft: 800,
      totalSpots: 999,
      firstPrize: '20.5 Lakhs',
      winnerPercentage: 59,
      maxTeams: 20,
      isHighlighted: false,
    },
    {
      id: 2,
      isPractice: false,
      prizePool: 'Amount',
      entryFee: 49,
      spotsLeft: 25000, // This will show "xx,xxx left" as in your image
      totalSpots: 125000, // This will show "xx,xx,xxx spots"
      firstPrize: '5 lakhs',
      winnerPercentage: 57,
      maxTeams: 20,
      isHighlighted: true,
    },
    {
      id: 3,
      isPractice: true,
      prizePool: 'Practice Contest',
      spotsLeft: 2,
      totalSpots: 5,
      firstPrize: 'Glory',
      winnerPercentage: 100,
      maxTeams: 5,
      isHighlighted: false,
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.headerText}>Contests</Text>
        
        {contestData.map((contest) => (
          <ContestCard
            key={contest.id}
            isPractice={contest.isPractice}
            prizePool={contest.prizePool}
            entryFee={contest.entryFee}
            spotsLeft={contest.spotsLeft}
            totalSpots={contest.totalSpots}
            firstPrize={contest.firstPrize}
            winnerPercentage={contest.winnerPercentage}
            maxTeams={contest.maxTeams}
            isHighlighted={contest.isHighlighted}
          />
        ))}
        
        {/* Dimension indicator as shown in the design */}
        <View style={styles.dimensionIndicator}>
          <Text style={styles.dimensionText}>328 x 144</Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  dimensionIndicator: {
    backgroundColor: '#9C27B0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dimensionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
