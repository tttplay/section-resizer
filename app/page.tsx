import { BottomSection, HorizontalDivider, HorizontalDividerComponent, TopSection } from '../components/horizontal-divider';
import { LeftSection, RightSection, VerticalDivider, VerticalDividerComponent } from '../components/vertical-divider';

export default function Home() {
  return (
    <div className="flex h-screen">
      <main className="relative flex flex-row flex-1 flex-grow overflow-hidden bg-gray-600">
        <VerticalDividerComponent initialX={20}>
          <LeftSection>
            <section className="relative w-full h-full bg-red-500" />
          </LeftSection>
          <VerticalDivider />
          <RightSection>

            <VerticalDividerComponent>
              <LeftSection>

                <HorizontalDividerComponent initialY={45}>
                  <TopSection>
                    <section className="relative w-full h-full bg-blue-500" />
                  </TopSection>
                  <HorizontalDivider />
                  <BottomSection>
                    <section className="relative w-full h-full bg-green-500" />
                  </BottomSection>
                </HorizontalDividerComponent>

              </LeftSection>
              <VerticalDivider />
              <RightSection>

                <HorizontalDividerComponent initialY={55}>
                  <TopSection>
                    <section className="relative w-full h-full bg-yellow-500" />
                  </TopSection>
                  <HorizontalDivider />
                  <BottomSection>
                    <section className="relative w-full h-full bg-violet-500" />
                  </BottomSection>
                </HorizontalDividerComponent>

              </RightSection>
            </VerticalDividerComponent>

          </RightSection>
        </VerticalDividerComponent>
      </main>
    </div>
  );
}